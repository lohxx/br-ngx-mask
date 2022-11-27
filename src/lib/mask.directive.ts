import { Directive, ElementRef, HostListener, Input, OnInit  } from '@angular/core';
import { RegexBuilder, RegexMap } from './regex-builder';


const IGNORE_EVENTS = ['deleteContentBackward'];

@Directive({
  selector: '[mask]'
})
export class MaskDirective implements OnInit {
  matchStart = false;
  start: RegexMap = {};
  groups: RegexMap = {};
  matches: string[] = [];
  regexBuilder: RegexBuilder | null;

  @Input() maskPattern: string = '';

  constructor(
    private elementRef: ElementRef<HTMLInputElement>,
  ) { 
    this.regexBuilder = null;
  }

  ngOnInit() {
    this.elementRef.nativeElement.maxLength = this.maskPattern.length;
    this.regexBuilder = new RegexBuilder(this.maskPattern);
    [this.start, this.groups] = this.regexBuilder.build();
  }

  @HostListener('paste', ['$event'])
  onPaste() {
    this.matches = [];
  }

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    if (IGNORE_EVENTS.indexOf(event.inputType) != -1) {
      return
    }
    
    console.log(event)
    this.applyRegex();
  }

  @HostListener('keydown.Backspace', ['$event']) onDelete() {
    if (!this.elementRef.nativeElement.value) {
      this.matches = [];
      return
    }
    let expressions = {...this.start, ...this.groups};
    this.matches = Object.keys(expressions).filter(
      rex => new RegExp(rex).exec(this.elementRef.nativeElement.value));
    this.matches.pop();
  }

  checkForMatches(regexs: RegexMap): boolean {
    let oldValue = '';
    let hasMatch = false;
    let replacement = '';
    for(let rex of Object.keys(regexs)) {
      if (this.matches.indexOf(rex) != -1) {
        continue
      }

      replacement = regexs[rex];
      oldValue = this.elementRef.nativeElement.value;
      this.elementRef.nativeElement.value = this.elementRef.nativeElement.value.replace(
        new RegExp(rex), replacement);

        if (oldValue != this.elementRef.nativeElement.value) {
        this.matches.push(rex);
        hasMatch = true;
      }
    }
    return hasMatch;
  }

  applyRegex(): void {
    this.checkForMatches(this.start);
    this.checkForMatches(this.groups);
  }

}
