
define('app/core/math', 
[
    
], 
function() {

    return {
        /**
         * @method move
         * @param {Number} x
         * @param {Number} y
         * @param {Number} dx
         * @param {Number} dy
         * @param {Number} dt
         * @returns {Object}
         */
        move: function(x, y, dx, dy, dt) {
            var nx = dx * dt,
                ny = dy * dt;
        
            return {
                x: x + nx,
                y: y + ny,
                dx: dx,
                dy: dy,
                nx: nx,
                ny: ny
            };
        },
        
        /**
         * @method pointMagnitude
         * @param {Number} x
         * @param {Number} y
         * @returns {Number}
         */
        pointMagnitude: function(x, y) {
            return Math.sqrt(x * x + y * y);
        },
        
        /**
         * @method vectorMagnitude
         * @param {Number} x1
         * @param {Number} y1
         * @param {Number} x2
         * @param {Number} y2
         * @returns {Number}
         */
        vectorMagnitude: function(x1, y1, x2, y2) {
            return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        },
        
        /**
         * @method entityIntersect
         * @param {Entity} entity1
         * @param {Entity} entity2
         * @param {Number} nx
         * @param {Number} ny
         * @returns {Object|null}
         */
        entityIntersect: function(entity1, entity2, nx, ny) {
            var pt = null,
                dir;
        
            if ( nx < 0 ) {
                pt = this.intersect(entity1, entity2, nx, ny);
                dir = 'right';
            } else if ( nx > 0 ) {
                pt = this.intersect(entity1, entity2, nx, ny);
                dir = 'left';
            }
            if ( !pt ) {
                if ( ny < 0 ) {
                    pt = this.intersect(entity1, entity2, nx, ny);
                    dir = 'bottom';
                } else if ( ny > 0 ) {
                    pt = this.intersect(entity1, entity2, nx, ny);
                    dir = 'top';
                }
            }
            if ( pt ) {
                var interceptPoint = this.entityIntercept(entity1, entity2, nx, ny);
                
                if ( interceptPoint ) {
                    pt = interceptPoint;
                } else {
                    pt.dir = dir;
                }
            }
            
            return pt;
        },
        
        /**
         * @method intersect
         * @param {Entity} entity1
         * @param {Entity} entity2
         * @param {Number} nx
         * @param {Number} ny
         * @returns {Object|null}
         */
        intersect: function (entity1, entity2, nx, ny) {
            var pt = null,
                bx = entity1.getX() + nx,
                by = entity1.getY() + ny,
                bw = entity1.getWidth(),
                bh = entity1.getHeight(),
                rx = entity2.getX(),
                ry = entity2.getY(),
                rw = entity2.getWidth(),
                rh = entity2.getHeight(),
                bhw, bhh, rhw, rhh, dx, dy, cx1, cy1, cx2, cy2;
        
            if ( bx >= rx - bw && bx <= rx + rw && by >= ry - bh && by <= ry + rh ) {
                bhw = entity1.getHalfWidth();
                bhh = entity1.getHalfHeight();
                rhw = entity2.getHalfWidth();
                rhh = entity2.getHalfHeight();
                cx1 = bx + bhw;
                cy1 = by + bhh;
                cx2 = rx + rhw;
                cy2 = ry + rhh;
                
                dx = Math.abs(cx1 - cx2) - (bhw + rhw);
                dy = Math.abs(cy1 - cy2) - (bhh + rhh);

                if ( dx < 0 && dy < 0 ) {
                    dx = Math.min(Math.min(bw, rw), -dx);
                    dy = Math.min(Math.min(bh, rh), -dy);
                    
                    pt = {
                        x: bx >= rx + (rw / 2) ? bx + dx + 1 : bx - dx - 1,
                        y: by >= ry + (rh / 2) ? by + dy + 1 : by - dy - 1
                    };
                }
                
                return pt;
            }
            
            return null;
        },
        
        /**
         * @method entityIntercept
         * @param {Entity} entity1
         * @param {Entity} entity2
         * @param {Number} nx
         * @param {Number} ny
         * @returns {Object|null}
         */
        entityIntercept: function(entity1, entity2, nx, ny) {
            var pt = null,
                bx = entity1.getX(),
                by = entity1.getY(),
                rx = entity2.getX(),
                ry = entity2.getY(),
                rw = entity2.getWidth(),
                rh = entity2.getHeight(),
                bhw = entity1.getWidth() / 2,
                dir;
        
            if ( nx < 0 ) {
                pt = this.intercept(bx + bhw, by + bhw, bx + nx + bhw, by + ny + bhw,
                    rx + rw + bhw, ry - bhw, rx + rw + bhw, ry + rh + bhw);
                dir = 'right';
            } else if ( nx > 0 ) {
                pt = this.intercept(bx + bhw, by + bhw, bx + nx + bhw, by + ny + bhw,
                    rx - bhw, ry - bhw, rx - bhw, ry + rh + bhw);
                dir = 'left';
            }
            if ( !pt ) {
                if ( ny < 0 ) {
                    pt = this.intercept(bx + bhw, by + bhw, bx + nx + bhw, by + ny + bhw,
                        rx - bhw, ry + rh + bhw, rx + rw + bhw, ry + rh + bhw);
                    dir = 'bottom';
                } else if ( ny > 0 ) {
                    pt = this.intercept(bx + bhw, by + bhw, bx + nx + bhw, by + ny + bhw,
                        rx - bhw, ry - bhw, rx + rw + bhw, ry - bhw);
                    dir = 'top';
                }
            }
            if ( pt ) {
                pt.x = pt.x - bhw;
                pt.y = pt.y - bhw;
                pt.dir = dir;
            }
            
            return pt;
        },
          
        /**
         * http://paulbourke.net/geometry/pointlineplane/
         * 
         * @method intercept
         * @param {Number} x1
         * @param {Number} y1
         * @param {Number} x2
         * @param {Number} y2
         * @param {Number} x3
         * @param {Number} y3
         * @param {Number} x4
         * @param {Number} y4
         * @returns {Object|null}
         */
        intercept: function(x1, y1, x2, y2, x3, y3, x4, y4) {
            var result = null, n, ua, ub;
                    
            n = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1));
            
            if ( n === 0 ) {
                return result;
            }
            ua = (((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3))) / n;
            
            if ( ua >= 0 && ua <= 1 ) {
                ub = (((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3))) / n;
                
                if ( ub >= 0 && ub <= 1 ) {
                    result = {
                        x: x1 + (ua * (x2 - x1)),
                        y: y1 + (ua * (y2 - y1))
                    };
                }
            }
            
            return result;
        }
    };
});