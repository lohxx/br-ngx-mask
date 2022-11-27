# BrNgxMask
Input mask library with zero dependency!


## How to use

Import and provide the library module on your application

```javascript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrNgxMaskModule } from 'br-ngx-mask';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrNgxMaskModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Add the directive on your input element. For now, the directive only works on numeric patterns.

```html
<div>
    <label for="cpf">CPF</label><br>
    <input type="text" id="cpf" mask [maskPattern]="'000.000.000-00'">
</div>
<div>
    <label for="cnpj">CNPJ</label><br>
    <input type="text"  id="cnpj" mask [maskPattern]="'00.000.000/0000-00'">
</div>

<div>
    <label for="pis">PIS</label><br>
    <input type="text"  id="pis" mask [maskPattern]="'000.00000.00-0'">
</div>
```

