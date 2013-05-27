/**
 * Verlet Point Class
 *
 * @param x <Number>
 * @param y <Number>
 */

function Point(x, y) {

    var pub = this;
    var oldx;
    var oldy;

    pub.x = 0;
    pub.y = 0;


    (pub.setPos = function (x, y) {

        pub.x = oldx = x;
        pub.y = oldy = y;
    })(x, y);


    pub.refresh = function () {

        var tempx = pub.x;
        var tempy = pub.y;
        pub.x += pub.x - oldx;
        pub.y += pub.y - oldy;
        oldx = tempx;
        oldy = tempy;

        checkBounds();
    };


    function checkBounds() {

        if (pub.x > width/ratio) {
            pub.x = width/ratio;
        }

        if (pub.x < 0) {
            pub.x = 0;
        }

        if (pub.y > height/ratio) {
            pub.y = height/ratio;
        }

        if (pub.y < 0) {
            pub.y = 0;
        }
    }
}