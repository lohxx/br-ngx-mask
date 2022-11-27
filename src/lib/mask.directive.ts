import { Directive, ElementRef, HostListener, Input, OnInit  } from '@angular/core';
import { RegexBuilder, RegexMap } from './regex-builder';


const IGNORE_EVENTS = ['deleteContentBackward'];

@Directive({
  selector: '[mask]'
})
export class MaskDirective implements OnInit {
  groups: RegexMap = {};
  matches: string[] = [];
  regexBuilder: RegexBuilder | null = null;

  @Input() maskPattern: string = '';

  constructor(
    private elementRef: ElementRef<HTMLInputElement>,
  ) { }

  ngOnInit() {
    this.elementRef.nativeElement.maxLength = this.maskPattern.length;
    this.regexBuilder = new RegexBuilder(this.maskPattern);
    this.groups = this.regexBuilder.build();
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

    this.checkForMatches();
  }

  @HostListener('keydown.Backspace', ['$event']) onDelete() {
    this.matches = Object.keys(this.groups).filter(
      rex => new RegExp(rex).exec(this.elementRef.nativeElement.value));
    this.matches.pop();
  }

  checkForMatches(): boolean {
    let oldValue = '';
    let hasMatch = false;
    let replacement = '';
    for(let rex of Object.keys(this.groups)) {
      if (this.matches.indexOf(rex) != -1) {
        continue
      }

      replacement = this.groups[rex];
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
}
