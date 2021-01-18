function floydSteinbergDithering(context, palArr, w, h, errorMultiplier = 1.0)
{
    var imgData = context.getImageData(0, 0, w, h);
    var data = imgData.data;

    for(var y = 0; y < h; y++)
    {
        for (var x = 0; x < w; x++)
        {
            var id = ((y * w) + x) * 4;

            oldpixel = [data[id], data[id + 1], data[id + 2]];

            // determine closest color in palette
            newpixel = findClosest(oldpixel, palArr);

            // apply new pixel to data
            data[id] = newpixel[0];
            data[id + 1] = newpixel[1];
            data[id + 2] = newpixel[2];

            // set alpha channel to 255
            data[ id + 3 ] = 255;

            // calculate quantization error
            quantErr = getQuantErr(oldpixel, newpixel);
            
            // offset: pixel[x+1, y]
            id = ((y * w) + (x + 1)) * 4;
            if (id < data.length) {
                err = applyErr([data[id], data[id + 1], data[id + 2]], quantErr, (7/16), errorMultiplier);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }

            // offset: pixel[x-1, y+1]
            id = (((y + 1) * w) + (x - 1)) * 4; 
            if (id < data.length) {
                err = applyErr([data[id], data[id + 1], data[id + 2]], quantErr, (3/16), errorMultiplier);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }

            // offset: pixel[x, y+1]
            id = (((y + 1) * w) + x) * 4;
            if (id < data.length) {
                err = applyErr([data[id], data[id + 1], data[id + 2]], quantErr, (5/16), errorMultiplier);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }            

            // offset: pixel[x+1, y+1]
            id = (((y + 1) * w) + (x + 1)) * 4;
            if (id < data.length) {
                err = applyErr([data[id], data[id + 1], data[id + 2]], quantErr, (1/16), errorMultiplier);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
        }
    }
    context.putImageData(imgData, 0, 0)
}

function findClosest(oldpixel, palArr) {
    var maxDist = 766; // 255 * 3 + 1
    var idx = 0;
    for (var i = 0; i < palArr.length; i++) {
        dist = Math.abs(oldpixel[0] - palArr[i][0]) + Math.abs(oldpixel[1] - palArr[i][1]) + Math.abs(oldpixel[2] - palArr[i][2]);
        if (dist < maxDist) {
            maxDist = dist;
            idx = i;
        }
    }
    return palArr[idx];
}

function getQuantErr(oldpixel, newpixel) {
    oldpixel[0] -= newpixel[0];
    oldpixel[1] -= newpixel[1];
    oldpixel[2] -= newpixel[2];
    return oldpixel;
}

function applyErr(pixel, error, factor, multiplier) {
    pixel[0] += error[0] * factor * multiplier;
    pixel[1] += error[1] * factor * multiplier;
    pixel[2] += error[2] * factor * multiplier;
    return(pixel);
}