G.ARROW = {
    //calculate coordinates of polyline dots of the arrow
    f_generate_arr_xy_for_arrow: function (start_end, stretching_ratio) {
        //symmetric line of the arrow
        var wh = start_end.f_get_wh();
        var a = start_end.a;
        //half width of arrow zone
        var ort = wh.f_50().f_rotate_90();

        //levels along domino - on width (on symmetryc line: base to the tip_point)
        var w_BASE = ort.f_scale(V.ARROW.p_w_base * stretching_ratio);
        var w_IN = ort.f_scale(V.ARROW.p_w_in * stretching_ratio);
        var w_OUT = ort.f_scale(V.ARROW.p_w_out * stretching_ratio);

        //levels across domino - on height (on ort to the symmetric line)
        var h_BASE_CUT = wh.f_scale(V.ARROW.p_h_base_cut).f_add(a);
        var h_IN = wh.f_scale(V.ARROW.p_h_in).f_add(a);
        var h_OUT = wh.f_scale(V.ARROW.p_h_out).f_add(a);
        var h_END_CUT = wh.f_scale(V.ARROW.p_h_end_cut).f_add(a);

        //generate symmetric pairs of points
        var ab_BASE = new G.F_AB(h_BASE_CUT.f_add(w_BASE), h_BASE_CUT.f_sub(w_BASE));
        var ab_IN = new G.F_AB(h_IN.f_add(w_IN), h_IN.f_sub(w_IN));
        var ab_OUT = new G.F_AB(h_OUT.f_add(w_OUT), h_OUT.f_sub(w_OUT));

        //arrow has 3 + 1 + 3 = 7 points, tha are symmetric
        return [ab_BASE.a, ab_IN.a, ab_OUT.a, h_END_CUT, ab_OUT.b, ab_IN.b, ab_BASE.b];
    },

    f_generate_polygon_dots: function (start_a_end_b, stretching_ratio) {
        //array of 3 + 1 + 3 = 7 points for polygon
        arr_points = G.ARROW.f_generate_arr_xy_for_arrow(start_a_end_b, stretching_ratio);

        //f_xy_to_string return string by 2 numbers
        function f(i) { return (arr_points[i].f_xy_to_string()); };
        //array of points as string
        var arr_string = G.MATH.f_gen_array_by_function(arr_points.length, f);

        return ('<polygon points="' + arr_string.join(' ') + '"/>');
    },
};