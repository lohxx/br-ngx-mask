const NON_WORD_REGEXP = /\W+/;

export interface RegexMap {
  [key: string]: string
}

export class RegexBuilder {
    constructor(private pattern: string) {}

    build(): RegexMap {
        let regex = '';
        let currentGroup = '';
        let regexAcc = `(?<=`;
        let charGroups: RegexMap = {};

        for (var i = 0; i < this.pattern.length; i++) {
            if (NON_WORD_REGEXP.test(this.pattern[i])) {
                if (Object.keys(charGroups).length == 0) {
                    regex =`(?<=^\\d{${currentGroup.length}})`
                    charGroups[regex] = this.pattern[i];
                    regexAcc = `^\\d{${currentGroup.length}}\\${this.pattern[i]}`;
                    currentGroup = ''
                    continue
                }

                regex = `(?<=${regexAcc}\\d{${currentGroup.length}})`;
                charGroups[regex] = this.pattern[i];
                regexAcc += `\\d{${currentGroup.length}}\\${this.pattern[i]}`;
            
                currentGroup = ''
                continue
            }
            currentGroup += this.pattern[i];
        }
        return charGroups
    }

}