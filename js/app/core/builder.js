
define('app/core/builder', [], function() {
    
    function Builder() {}
    
    /**
     * @method buildDomModel
     * @param {Element} parent
     * @param {Object} data
     * @return {Element}
     */
    Builder.prototype.buildDomModel = function(parent, data) {
        var fragment, i, el;

        if ( data.tag ) {
            /**
             * TODO: Optimize this
             */
            fragment = document.createDocumentFragment();
            
            if ( data.tag == 'textNode' ) {
                el = document.createTextNode("");
            } else {
                el = $('<' + data.tag + '>');
            }
            
            for ( var p in data ) {
                /* jshint forin: false */
                if ( !data.hasOwnProperty(p) ) {
                    continue;
                }
                switch(p) {
                    case null:
                    case "tag":
                    case "childs":
                        break;
                    case "rel":
                    case "colspan":
                    case "scrolling":
                    case "frameborder":
                    case "vspace":
                    case "hspace":
                    case "marginheight":
                    case "marginwidth":
                    case "allowtransparency":
                        el.attr(p, data[p]);
                        break;
                    case "value":
                        el.val(data[p]);
                        break;
                    case "className":
                        el.addClass(data[p]);
                        break;
                    case "styles":
                        el.css(data[p]);
                        break;
                    case "html":
                        el.html(data.html);
                        break;
                    case "events":
                        /* jshint loopfunc: true */
                        $.each(data[p], function(i, event) {
                            for (var k in event) {
                                el.bind(k, event[k]);
                            }
                        });
                        break;
                    default:
                        el.attr(p, data[p]);
                        break;
                }
            }
            if ( parent ) {
                fragment.appendChild(el[0]);
            }
            if ( data.childs ) {
                this.buildDomModel(el[0], data.childs, null, true);
            }
            if ( parent ) {
                if ( parent.jquery ) {
                    parent.append(fragment);
                } else {
                    parent.appendChild(fragment);    
                }
                
            }
            
            return el;

        } else if ( typeof data == "object" ) {
            for( i in data ) {
                if ( !data.hasOwnProperty(i) ) {
                    continue;
                }
                this.buildDomModel(parent, data[i], null, true);
            }
        }
        
        return null;
    };
    
    return Builder;
});