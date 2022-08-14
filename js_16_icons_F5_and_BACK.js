G.ICONS = {
    //buttons will have this ratio of cell
    buttons_scale_ratio: 0.8,

    D: {
        DOTS_IN_GRID: new G.F_XY(20, 20),

        REPLAY_GAME: "M 0,0 v 20 h 20 v -20 Z " +
            "M 6,10 l 4,8 h -4 l -4,-8 l 4,-8 h 4 Z" +
            "M 14,10 l 4,8 h -4 l -4,-8 l 4,-8 h 4 Z",
        REPLAY_GAME_AB: G.F_AB.f_by_center_and_wh(G.F_XY.P11, G.F_XY.P22),

        F5: "M 0,0 v 20 h 20 v -20 Z " +
            "M 2,2 h 2 h 5 v 2 h -5 v 5 " + "h 5 v 2 h -5 v 7 h -2 Z " +
            "M 11,2 h 7 v 2 h -5 v 4 h 1 " +
            "a 4,4 0 0 1 4,4 v 2 a 4,4 0 0 1 -4,4 h -3 v -2 h 3 " +
            "a 2,2 0 0 0 2,-2 v -2 " + "a 2,2 0 0 0 -2,-2 h -3 Z ",
        F5_AB: G.F_AB.f_by_center_and_wh(new G.F_XY(G.AB.board_nxy.x - 1, 1), G.F_XY.P22),

        MOVE_BACK: "M 0,0 v 20 h 20 v -20 Z " +
            "M 2,10 h 8 v 3 h -8 Z" +
            "M 8,8 v -4 l 4,-2 h 4 v 16 h -4 v -12 l -4 2 Z",
        MOVE_BACK_AB: G.F_AB.f_by_center_and_wh(new G.F_XY(1, G.AB.board_nxy.y - 1), G.F_XY.P22),

        INFO: "M 0,0 v 20 h 20 v -20 Z " +
            "M 10,1 a 9,9 0 0 1 0,18 a 9,9 0 0 1 0,-18 Z" +
            "M 9,7 h 2 v 9 h -2 Z " +
            "M 9,3 h 2 v 2 h -2 Z",
        INFO_AB: G.F_AB.f_by_center_and_wh(G.AB.board_nxy.f_sub(G.F_XY.P11), G.F_XY.P22)
    },

    //return string of transfer matrix: scale and translate
    f_transform_to_string: function (gotten_xy_scale, gotten_corner_00) {
        var string_scale_x = G.MATH.f_n_to_string(gotten_xy_scale.x, 5);
        var string_scale_y = G.MATH.f_n_to_string(gotten_xy_scale.y, 5);

        //two digits of translation, separated by ","
        var string_translate = gotten_corner_00.f_xy_to_string(5);
        var six_digits = string_scale_x + ',0,0,' + string_scale_y + ',' + string_translate
        return 'transform="matrix(' + six_digits + ')" ';
    },

    //path with transform matrix by rectangle area ab and Key_name
    f_path_svg: function (ab, key_name) {
        var scale_xy = ab.f_get_wh().f_div(G.ICONS.D.DOTS_IN_GRID);
        var transform_matrix = G.ICONS.f_transform_to_string(scale_xy, ab.a);

        return ('<path ' + transform_matrix + 'd="' + G.ICONS.D[key_name] + '"/>');
    },

    //group with all game buttons
    f_all_buttons: function () {
        function f_button(gotten_button_name) {
            var ab = G.AB.TRANSFORM.f_ab(G.ICONS.D[gotten_button_name + "_AB"]);
            var ab_scaled = ab.f_center_scale(G.ICONS.buttons_scale_ratio);

            //console.log(ab, ab.f_get_wh(), ab_scaled, ab_scaled.f_get_wh(),  gotten_button_name);
            return G.ICONS.f_path_svg(ab_scaled, gotten_button_name);
        }
        var TOP_BUTTONS = f_button("REPLAY_GAME") + f_button("F5");
        var LOW_BUTTONS = f_button("MOVE_BACK") + f_button("INFO");

        return '<g id="ID_BUTTONS ">' + TOP_BUTTONS + LOW_BUTTONS + '</g>';
    },

    //do we click on button by button name?
    f_is_pixel_on_button: function (clicked_pixel_xy, gotten_button_name) {
        var ab = G.AB.TRANSFORM.f_ab(G.ICONS.D[gotten_button_name + "_AB"]);
        var ab_scaled = ab.f_center_scale(G.ICONS.buttons_scale_ratio);

        var is_pixel_inside_button = ab_scaled.f_has_pixel_inside(clicked_pixel_xy);
        return is_pixel_inside_button;
    }
};



