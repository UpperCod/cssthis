# Cssthis

Esta es una pequeña librería de tan solo **1kbs**, para la gestión de estilos en componentes basados en JSX, se ha creado inicialmente para **Preact**, pero hoy ofrece soporte también para **React**, mediante **cssthis-react**.

## Instalación

La instalación depende de su entorno de desarrollo.

| Tipo | Package | Github | Install |
|:--------|:---------|:--------|:---------|
| **Rollup** | [link](https://www.npmjs.com/package/rollup-plugin-cssthis) | [link](https://github.com/uppercod/rollup-plugin-cssthis) | `yarn add -D rollup-plugin-cssthis` |
| **Parceljs** | [link](https://www.npmjs.com/package/parcel-plugin-cssthis) | [link](https://github.com/UpperCod/parcel-plugin-cssthis) | `yarn add -D parcel-plugin-cssthis` |
| **Preact** | [link](https://www.npmjs.com/package/cssthis) | [link](https://github.com/UpperCod/cssthis) | `yarn add cssthis` |
| **React** | [link](https://www.npmjs.com/package/cssthis-react) | [link](https://github.com/UpperCod/cssthis-react) | `yarn add cssthis-react` |

La documentación de **cssthis** y **cssthis-react** es igual, ya que no hay diferencias de uso.

```js
/** preact **/
import {style,Theme} from "cssthis"
/** React **/
import {style,Theme} from "cssthis-react"
```


## Motivación

Hoy existen múltiples herramientas para gestionar el estilo dentro de componentes basados en **JSX**, estas logran resolver el problema, pero generan otros adicionales :

* Una carga adicional en el cliente, sea por el excesivo tamaño de estas libreria.

* Abandonan lo simple del css, por ejemplo, en el uso de objetos para la creación de estilos, semántica poco natural en anidaciones y generación de propiedades dinámicas.


Cssthis, busca no abandonar la hoja de estilo css, de hecho aprovecha el potencial de las herramientas de **bundle** y **postcss**, para preprocesar el css, logrando generar **estilos con nombre de clase aleatoria**, el objetivo de esto es proteger el css que se manifieste dentro del selector de raíz al que llamamos **:this**.

Cssthis es simple, por ejemplo si su hoja de estilo fuera la siguiente.

```css
:this{
  width : 100px;
  height : 100px;
  background:black;
}
```

Esto sería impreso en el navegador por cssthis luciendo así:

```css
._rQH{
  width : 100px;
  height:100px;
  background:black;
}
```

> **._rQH** es generado de forma aleatoria, Cssthis se asegura que el nombre de la clase no exista definido previamente  en el documento.

## Ecosistema

Cssthis posee 2 grandes procesos, uno orientado al uso de herramientas de empaquetado(bundle) como **rollup**, **parceljs** o **webpack**, estas logran traducir el css mediante **cssthis-parse** que aprovecha el potencial de **postcss**.

### Empaquetador(bundle)

#### 1. Obtener la hoja de estilo
```css
:this{
  width: 100px;
  height: 100px;
  background: this(primary);
}
```
#### 2. Generar el template string, mediante postcss
```js
`.${props.cn}{
  width: 100px;
  height: 100px;
  background: ${props.cn};
}`
```

#### 3. Generar una función de plantilla, mediante la herramienta de bundle en la exportación del css.

```js
(props)=>`.${props.cn}{
  width: 100px;
  height: 100px;
  background: black;
}`
```

> Cómo cssthis usa **Postcss** ud podrá hacer uso  de la mayor cantidad de utilidades que este ofrece como **Autoprefixer**, **Cssnano** y más.

### Componente

Para la gestion de estilo en el navegador, ud deberá trabajar a base de :

```js
import {Theme,style} from "cssthis";
```
* `style( tag:string, props?:Object ):Function` : Esta funcion crea un componente que posee acceso al nombre de clase único asignado al estilo.
* `Theme` : Este componente permite modificar las propiedades base con las que se definen el estilo al momento de usar la funcion `style`.

### Ejemplo

supongamos que poseemos un componente a base de **preact**, con las siguientes características.

```
components/button
├─── style.this.css
└─── index.js
```

#### components/button/index.js

a continuación se enseña cómo se compone un componente que usa cssthis, favor note el uso de la función **style**, esta crea un componente que contiene la clase aleatoria predefinida a usar.

```js
import {h} from "preact";
import css from "./style.this.css";
import {style} from "cssthis";

export default style("button")(css)
```

> solo eso basta para crear un componente a base de cssthis.

``` js
import Button from "./components/button";

<Button>button!<Button>
```

## Cssthis style

### Introducción

Esta función permite crear un componente tipo contenedor que tiene acceso a la clase aleatoria, generada por cssthis.

```js
import {style} from "cssthis";
import css from "./style.this.css";

export default style(
   //tagName
   "div",
   //props,
   {
       primary : "black"
   }

)(
   css
);

```

los argumentos que recibe esta función son :

* **tagName** : {String} el componente contenedor será un elemento específico a base de esta variable.
* **props** : [Object] el componente puede acceder a las propiedades dadas por este objeto.


### Variables externas

El segundo argumento de style, es un objeto, este permite compartir variables con el css a imprimir, el siguiente ejemplo enseña cómo utilizar esas variables.

```css
:this{
   background : this(primary);
}
```
> Note the use of `this (primary)` as a function, this will bring from the second argument given to the `style` function the ** primary ** property. The properties defined in the second style argument are considered as default properties, they can be replaced by using the `Theme` component.



### Múltiples estilos

El css dado a la función del retorno también puede ser un arreglo de estilos, como enseña el siguiente ejemplo, cada estilo recibirá la misma clase aleatoria, el css se reescribirá en cascada, por lo que el último estilo primara sobre los otros.

```js
import {style} from "cssthis";
import cssHeader from "./header.this.css";
import cssAside from "./aside.this.css";
import cssBody from "./body.this.css";
import cssFooter from "./footer.this.css";

export default style(
   "div"
)([
   cssHeader,
   cssAside,
   cssBody,
   cssFooter
]);

```

## Cssthis Theme


### Introducción

Este componente permite crear contextos, que modifiquen u otorguen propiedades adicionales al css.

ud puede usar `this(<property>)`, para obtener la propiedad dada por `Theme`.
```css
:this{
   background : this(primary);
}
```
La definiciones de propiedades a compartir con el css, se logran simplemente definiendolas como propiedades del componente `Theme`
```js
import css from "./style.this.css";
import {Theme,style} from "cssthis";

let Button = style("button",{primary:"teal"})(css);

/** reander **/
<div>
   <Button>color teal</Button>
   <Theme primary="crimson">
       <Button>color crimson</Button>
   </Theme>
</div>

```

> El componente `Theme` crea un contexto que extiende al contexto default, al momento de crear el el componente `Button`.

### Ciclo de vida

Si el componente `Theme` es desmontado del documento, este eliminará todos los estilos asociados a él, evitando la sobreescritura de estilos.

## Selector :this

Este selector le otorga la capacidad de apuntar a la clase aleatoria generada por cssthis, a continuación se enseña como se puede utilizar en diversas situaciones


### Selección por atributo

Ud puede aplicar estilos condicionales a ciertos atributos

```css
/** opción 1**/
:this([src]){}
/** opción 2**/
:this[src]{}
```

### Selección por atributos múltiples

Al usar `:this(<selectors>)`, ud podrá crear una selección multiple.

```css
/** opción 1**/
:this([src], [title]){}
/** opción 2**/
:this[src],
:this[title]{}
```

### Selección por atributo condicional

ud puede aplicar selectores adicionales, que se concatenan a cada selector dado a **:this**
```css
/** opción 1**/
:this([src], [title]):not([alt]){}
/** opción 2**/
:this[src]:not([alt]){}
:this[title]:not([alt]){}
```

### Selectores por patrón

```css
/** opción 1**/
:this([src*=.jpg]){}
/** opción 2**/
:this[src*=.jpg]{}
```

### Selector por estado

```css
:this:checked{}
```

### Selector por acompañamiento de clase

```css
/** opción 1**/
:this(.my_class){}
/** opción 2**/
:this.my_class{}
```

### Selector por tagName

Mediante este tipo de selectores, ud puede generar un estilo condicional para distintos tipos de tagName, esto es útil al momento de crear el componente mediante la función `style`, ya que puede ud generar múltiples componentes usando la misma base de estilo pero cada componente poseyendo distintos tipos de etiqueta tagName.

```css
:this(button){}
```

### Selector por contexto

Todo estilo que se defina, será cubierto por **:this** a excepción de los selectores que usen :global.

```css
.button{}
/** es equivalente a **/
:this .button{}
```

### Contexto keyframes

estas también son prefijadas por :this, por lo que la animación creada, solo funcionaran dentro del componente.

```css
.circle{
 animation : move 1s alternate infinite;
}

@keyframes move{
 0%{ transform: translate(0px,0px) }
 100%{ transform: translate(100px,100px) }
}
```

### Contexto de propiedades

Mediante el segundo argumento dado a `style`, ud podrá compartir propiedades a la hoja de estilo y usar mediante el uso de `this(property)`.

```css
button{
 background : this(primary);
 padding : this(paddingTop) this(paddingLeft);
}
```

```js
import css from "./style.this.css";
import {style} from "cssthis";

export default style("div",{
 primary : "black",
 paddingTop : "10px",
 paddingLeft : "20px"
})
```

## Selector :global

Si ud quiere generar estilos que escapen del contexto de `:this` deberá hacer uso del selector `:global`.

### Selección individual

```css
:globa body{}
```

### Selección múltiple

```css
:globa(h1,h2,h3,h4,h5,h6){}
```

