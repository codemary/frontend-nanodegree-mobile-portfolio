## Website Performance Optimization portfolio project

The task was to optimize the online portfolio for speed, in particular, the critical rendering path and make the page render as quickly as possible.

### Optimization

 The current score 93/100 for both mobile and desktop.

1. /index.html :

  a. CSS was inlined for :

 ```html

 <link href="css/style.min.css" rel="stylesheet">
 <link href="css/print.min.css" rel="stylesheet">

 ```  

 b. Removed Open-Sans web font :

 ```html

 <link href="//fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet">

 ```

2. views/pizza.html :

  Inlined css :

  ```html

  <link rel="stylesheet" href="css/style.min.css">

  ```

3. JavaScript Optimizations :

  a. Replaced the images with optimized responsive images.

  ```js

  -  pizzaImage.src = "images/pizza.png";
  +  pizzaImage.src = "img/pizza-lg.png";

  -  elem.src = "images/pizza.png";
  +  elem.src = "img/pizza-sm.png";

  ```

  b. Moved `document.querySelectorAll` out of the for loop and stored query result in a variable for reuse.

  ```js
  // Iterates through pizza elements on the page and changes their widths
  function changePizzaSizes(size) {
  -    for (var i = 0; i < document.querySelectorAll(".randomPizzaContainer").length; i++) {
  -      var dx = determineDx(document.querySelectorAll(".randomPizzaContainer")[i], size);
  -      var newwidth = (document.querySelectorAll(".randomPizzaContainer")[i].offsetWidth + dx) + 'px';
  -      document.querySelectorAll(".randomPizzaContainer")[i].style.width = newwidth;
  +      var dx = determineDx(document.querySelector(".randomPizzaContainer"), size);
  +           var newwidth = (document.querySelector(".randomPizzaContainer").offsetWidth + dx) + 'px';
  +      var elements = document.querySelectorAll(".randomPizzaContainer");
  +    for (var i = 0; i < elements.length; i++) {
  +      elements[i].style.width = newwidth;
    }
  }

  ```

  c.1. Moved `document.body.scrollTop` out of the for loop and stored query result in a variable for reuse.

  c.2. Used translateX() and translateZ(0) transform functions to the sliding pizza

  ```js

      for (var i = 0; i < items.length; i++) {
    -    var phase = Math.sin((document.body.scrollTop / 1250) + (i % 5));
    -    items[i].style.left = items[i].basicLeft + 100 * phase + 'px';
    +    var phase = Math.sin(top + (i % 5));
    +  var left = -items[i].basicLeft + 1000 * phase + 'px';
    +               items[i].style.transform = "translateX("+left+") translateZ(0)";
       }

  ```

  d. Used `requestAnimationFrame` method in the scroll event listener.

  ```js

  -window.addEventListener('scroll', updatePositions);
  +window.addEventListener('scroll', function() {
  +       window.requestAnimationFrame(updatePositions);
  +});

  ```

  e. Reduced the number of pizzas from 200 to 32 so that there are fewer items to render.

  ```js

  -  for (var i = 0; i < 200; i++) {
  +  for (var i = 0; i < 32; i++) {

  ```

### Installation and Testing

1. Clone the repo:

  ```bash

  $ git clone https://github.com/codemary/frontend-nanodegree-mobile-portfolio

  ```

2. Install the packages

  ```bash

  $ cd frontend-nanodegree-mobile-portfolio

  $ npm install

  ```

3. Analyze locally using `grunt-pagespeed` and `ngrok`

  ```bash

  $ cd dist
  $ python -m SimpleHTTPServer 8080
  $ cd ..
  $ grunt

  ```

4. Or Analyze at Google Pagespeed Insights

  ```bash

  $ cd dist
  $ python -m SimpleHTTPServer 8080

  #Open a new tab in the terminal
  $ ngrok http 8080

  ```

Copy the forwarded url and paste it in the [pagespeed insights](https://developers.google.com/speed/pagespeed/insights/) page.
