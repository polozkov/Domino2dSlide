//HTML elements (by id_entificators)
G.EL = {
    //first string with the name of the puzzle
    DIV_INFO_STRING: document.getElementById("idDivTextPuzzleName"),

    //main SVG for the game_board (SVG is after INFO_STRING)
    SVG: document.getElementById("idShowMainGame"),

    //RULE_TEXT is below SVG
    DIV_RULE_TEXT: document.getElementById("idDivForRules"),

    //folifill for calculating LEFT-TOP corner's coordinate (x,y) of the element on the html-page
    f_corner_coordinates: function (elem) {
        //calculate (left, top) corner for outdated browsers
        function getOffsetSum(elem) {
            var top = 0, left = 0;
            while (elem) {
                top = top + parseInt(elem.offsetTop)
                left = left + parseInt(elem.offsetLeft)
                elem = elem.offsetParent
            }

            return new G.F_XY(left, top);
        };

        //calculate (left, top) corner for not-outdated (other) browsers by elem.getBoundingClientRect();
        function getOffsetRect(elem) {
            var box = elem.getBoundingClientRect();
            var body = document.body;
            var docElem = document.documentElement;

            var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
            var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

            var clientTop = docElem.clientTop || body.clientTop || 0;
            var clientLeft = docElem.clientLeft || body.clientLeft || 0;

            var top = box.top + scrollTop - clientTop;
            var left = box.left + scrollLeft - clientLeft;

            return new G.F_XY(Math.round(left), Math.round(top));
        };

        return ((elem.getBoundingClientRect) ? getOffsetRect(elem) : getOffsetSum(elem));
    },

    //svg Left-Top coordinates of corner
    f_svg_xy: function () { return G.EL.f_corner_coordinates(G.EL.SVG); },

    //if has no property .PageX, pageY, generate this property
    f_fix_page_xy: function (e) {
        if (e.pageX == null && e.clientX != null) { // если нет pageX..
            var html = document.documentElement;
            var body = document.body;

            e.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0);
            e.pageX -= html.clientLeft || 0;

            e.pageY = e.clientY + (html.scrollTop || body && body.scrollTop || 0);
            e.pageY -= html.clientTop || 0;
        }
    },

    f_get_clicked_xy_on_SVG: function (gotten_event) {
        G.EL.f_fix_page_xy(gotten_event);
        //coordinates from the SVG corners
        var ex = gotten_event.pageX - G.EL.f_svg_xy().x;
        var ey = gotten_event.pageY - G.EL.f_svg_xy().y;
        return new G.F_XY(ex, ey);
    },

    //set all sizes for needful html-elements
    f_set_element_sizes: function () {
        //set SVG sizes (cut wh to the board square)
        function f_set_sizes_for_SVG(uncutten_wh) {
            uncutten_wh = uncutten_wh.f_ratio_maximize(G.F_XY.f_by_arr(V.board_sizes_01));
            G.EL.SVG.style.width = uncutten_wh.x + "px";
            G.EL.SVG.style.height = uncutten_wh.y + "px";
        }

        //calculate free SVG sizes (without cut borders)
        function f_calc_uncutten_wh(info_h, client_wh) {
            var cutten_wh = new G.F_XY(client_wh.x, client_wh.y);
            cutten_wh.y -= info_h; //inscribe both: info_string and SVG 
            if (client_wh.y < (info_h * 4)) {
                cutten_wh.y = client_wh.f_get_min();
            }
            return cutten_wh;
        }

        var working_area_w = Math.min(
            document.body.scrollWidth, document.documentElement.scrollWidth,
            document.body.offsetWidth, document.documentElement.offsetWidth,
            document.body.clientWidth, document.documentElement.clientWidth
        );

        var working_area_h = Math.min(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );

        //self-calling function by info_string_Height and client sizes
        (function f_calc_and_set(info_h, client_w, client_h) {
            var el_wh = f_calc_uncutten_wh(info_h, new G.F_XY(client_w, client_h));
            f_set_sizes_for_SVG(el_wh);

            //client drawing area by the Pythagorean theorem
            var client_diagonal = Math.sqrt((client_h * client_h) + (client_w * client_w));
            var font_height = client_diagonal * V.ratio_text_to_body_client;

            //set font sizes for texts depending of client_Width_Heidht
            G.EL.DIV_INFO_STRING.style.fontSize = Math.round(font_height) + "px";
            G.EL.DIV_RULE_TEXT.style.fontSize = Math.round(font_height) + "px";

        }(G.EL.DIV_INFO_STRING.clientHeight, working_area_w, working_area_h));
    }
};

G.EL.f_set_element_sizes();