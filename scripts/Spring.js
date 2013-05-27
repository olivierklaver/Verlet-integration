/**
 * Verlet Spring Class
 *
 * @param a <Point>
 * @param b <Point>
 */

function Spring(a, b) {

    var pub = this;

    var dx = a.x - b.x;
    var dy = a.y - b.y;
    var restingDistance = Math.sqrt(dx * dx + dy * dy);

    pub.pointa = a;
    pub.pointb = b;


    pub.contract = function () {

        // calculate the distance
        var dx = pub.pointb.x - pub.pointa.x;
        var dy = pub.pointb.y - pub.pointa.y;
        var h = Math.sqrt(dx * dx + dy * dy);

        // difference scalar
        var difference = restingDistance - h;

        // translation for each Point.
        var translateX = (difference * dx / h) * Spring.stiffness;
        var translateY = (difference * dy / h) * Spring.stiffness;

        pub.pointa.x -= translateX;
        pub.pointa.y -= translateY;

        pub.pointb.x += translateX;
        pub.pointb.y += translateY;
    }
}

Spring.stiffness = .2;