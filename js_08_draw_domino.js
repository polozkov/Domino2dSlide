G.DOMINO.DRAW = {
    //draw circles (domino dots)
    f_one_circle: function (obj_center, r) {
        var cx = 'cx' + '="' + G.MATH.f_n_to_string(obj_center.x) + '" ';
        var cy = 'cy' + '="' + G.MATH.f_n_to_string(obj_center.y) + '" ';
        var r = 'r' + '="' + G.MATH.f_n_to_string(r) + '" ';

        return '<circle ' + cx + cy + r + '/>';
    },

    //draw from 0 to 6 dots on the area_ab (we know orientation)
    f_arr_circles_on_semidomino: function (ab, dots_amount_from_0_to_6, vert_or_hori_0_or_1) {
        var wh = ab.f_get_wh();
        var step_xy = wh.f_scale(V.grid_circle_step);
        var radius = (wh.x + wh.y) / 2 * V.grid_circle_radius;

        var svg_text_dots = '';
        //array (with max length 7) of integer numbers 0..8
        var arr_slot_indexes = G.DOMINO.ARR_DOTS_SHOW[vert_or_hori_0_or_1][dots_amount_from_0_to_6];

        for (var i = 0; i < arr_slot_indexes.length; i++) {
            //object_xy from (-1..-1) to (1..1)
            var i_dxy = G.F_XY.f_by_arr(G.DOMINO.ARR_DX_DY_SQUARE[arr_slot_indexes[i]]);
            //center of small circle dot = CENTER_AB + (STEP_XY * i_dxy)
            var i_center = ab.f_get_center().f_add(i_dxy.f_mult(step_xy));

            //svg for one dot
            var i_circle = G.DOMINO.DRAW.f_one_circle(i_center, radius);
            svg_text_dots = svg_text_dots + i_circle;
        }

        return svg_text_dots;
    },

    //from 0+0 to 6+6 dots on domino
    f_arr_both_circles: function (n0_n1, ab_0_ab_1, vort_or_hori) {
        var semidomino_0 = G.DOMINO.DRAW.f_arr_circles_on_semidomino(ab_0_ab_1[0], n0_n1[0], vort_or_hori);
        var semidomino_1 = G.DOMINO.DRAW.f_arr_circles_on_semidomino(ab_0_ab_1[1], n0_n1[1], vort_or_hori);
        return ('<g>' + semidomino_0 + semidomino_1 + '</g>');
    },

    //dots for domino n_06 has radius = r, distance between dots = grid_step, 
    //vert_hori_01 is orientation of domino
    f_arr_circles: function (n_06_01, obj_center_01, r_xy, grid_step_xy, vert_or_hori_0_or_1) {

        //domino has 2 squares with dots
        function f_half_domino(n_semidomino_01) {
            var n_06 = n_06_01[n_semidomino_01];
            var obj_center = obj_center_01[n_semidomino_01];

            //numbers of dots has positions 0..8, array length = amount of dots
            var arr_slot_indexes = G.DOMINO.ARR_DOTS_SHOW[vert_or_hori_0_or_1][n_06];
            var svg_text_dots = '', dxy = {}, i_center = {}, i_circle;

            for (var i = 0; i < n_06; i++) {
                //one pair of 9 option from [-1,-1] to [1,1]
                dxy = G.F_XY.f_by_arr(G.DOMINO.ARR_DX_DY_SQUARE[arr_slot_indexes[i]]);

                //dot center := dxy[0..1] * grid_step + xy_center[0..1];
                i_center = dxy.f_mult(grid_step_xy).f_add(obj_center);

                //svg for one dot
                i_circle = G.DOMINO.DRAW.f_one_circle(i_center, r_xy.f_get_min());
                svg_text_dots = svg_text_dots + i_circle;
            }
            return svg_text_dots;
        }

        //all dots in both squares (semi_domino) are in group
        return ('<g>' + f_half_domino(0) + f_half_domino(1) + '</g>');
    },

    //return SVG element rect with rounded corners
    f_round_rect: function (obj_ab) {
        var wh = obj_ab.f_get_wh();
        var x = 'x' + '="' + G.MATH.f_n_to_string(obj_ab.a.x) + '"  ';
        var y = 'y' + '="' + G.MATH.f_n_to_string(obj_ab.a.y) + '"  ';

        var w = 'width' + '="' + G.MATH.f_n_to_string(wh.x) + '"  ';
        var h = 'height' + '="' + G.MATH.f_n_to_string(wh.y) + '"  ';

        var rx = 'rx' + '="' + G.MATH.f_n_to_string(wh.x * V.ratio_rounded_corners_to_rect) + '"  ';
        var ry = 'ry' + '="' + G.MATH.f_n_to_string(wh.y * V.ratio_rounded_corners_to_rect) + '"  ';

        return '<rect class="CLASS_RECT"' + x + y + w + h + rx + ry + '/>';
    },

    //draw domino with defined digits on defined area (area has 2 squares)
    f_domino_draw: function (n0_n1, ab_0_ab_1) {
        //border for rectangle (two squares union)
        var obj_ab_rect = ab_0_ab_1[0].f_op_union(ab_0_ab_1[1]);
        var t_rect = G.DOMINO.DRAW.f_round_rect(obj_ab_rect);

        //dots for both semi-dominos
        var hory_vert = obj_ab_rect.f_get_wh().f_vert_hory_01();
        var t_circles = G.DOMINO.DRAW.f_arr_both_circles(n0_n1, ab_0_ab_1, hory_vert);

        var group_id = '\n' + '<g id="' + G.MATH.f_id_by_n06n06(n0_n1) + '">';

        return group_id + t_rect + t_circles + '</g>' + '\n';
    }
};