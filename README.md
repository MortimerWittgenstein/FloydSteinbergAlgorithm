# JavaScript Floyd-Steinberg-Algorithm
This is my JavaScript implementation of the Floyd-Steinberg algorithm. It might not be very efficient but it does the job.

It features **custom color palettes** and an error multiplier to tweak the results.

I use it to do the dithering for the 5.65 inch 7-color EPD from waveshare.

## Pseudo Code
```
for each y
   for each x
      oldpixel        := pixel[x][y]
      newpixel        := find_closest_palette_color (oldpixel)
      pixel[x][y]     := newpixel
      quant_error     := oldpixel - newpixel
      pixel[x+1][y  ] := pixel[x+1][y  ] + quant_error * 7 / 16
      pixel[x-1][y+1] := pixel[x-1][y+1] + quant_error * 3 / 16
      pixel[x  ][y+1] := pixel[x  ][y+1] + quant_error * 5 / 16
      pixel[x+1][y+1] := pixel[x+1][y+1] + quant_error * 1 / 16
```
Source: [Wikipedia - Floyd-Steinberg dithering](https://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering)

## How to use
Create a 2d palette Array. Each color is represented by RGB values:
```
var palArr = [
    [  0,   0,   0], // black
    [255, 255, 255], // white
    [  0, 255,   0], // green
    [  0,   0, 255], // blue
    [255,   0,   0], // red
    [255, 255,   0], // yellow
    [255, 128,   0]  // orange
];
```

Then use a canvas context to process the image data:
```
var srcImg = new Image();

srcImg.onload = function () {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    
    canvas.width = this.width;
    canvas.height = this.height;

    ctx.drawImage(this, 0, 0, this.width, this.height);

    floydSteinbergDithering(ctx, palArr, this.width, this.height, 1.2);
}

srcImg.src = ...
```
After that set the source of the image to a picture you like to display.
See `index.html` and `main.js` for details.
You can tweak the results with the `errorMultiplier` parameter. Default value is `1.0`.