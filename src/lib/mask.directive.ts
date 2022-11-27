import { Directive, ElementRef, HostListener, Input, OnInit  } from '@angular/core';
import { RegexBuilder, RegexMap } from './regex-builder';


const IGNORE_EVENTS = ['deleteContentBackward'];

@Directive({
  selector: '[mask]'
})
export class MaskDirective implements OnInit {
  elementRef: any;
  groups: RegexMap = {};
  matches: string[] = [];
  regexBuilder: RegexBuilder | null;

  @Input() maskPattern: string = '';

  constructor(
    private el: ElementRef<any>,
  ) { 
    this.elementRef = this.el.nativeElement;
    this.regexBuilder = null;
  }

  ngOnInit() {
    this.elementRef.maxLength = this.maskPattern.length;
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

  @HostListener('keyup.Backspace', ['$event'])
  onDelete() {
    let regexps = Object.keys(this.groups);
    let inputValue = this.elementRef.value;
    this.matches = inputValue ? [regexps[0]] : [];
    for(let rex of regexps) {
      let match: RegExpMatchArray | null = inputValue.match(new RegExp(rex));
      if (match?.index && inputValue[match.index] == this.groups[rex]) {
        this.matches.push(rex);
      }
    }
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
      oldValue = this.elementRef.value;
      this.elementRef.value = this.elementRef.value.replace(
        new RegExp(rex), replacement);

        if (oldValue != this.elementRef.value) {
        this.matches.push(rex);
        hasMatch = true;
      }
    }
    return hasMatch;
  }
}
