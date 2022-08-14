//view of the domino
var V = {
    is_random_perm: true,      //need to mix dominos?
    is_random_rotations: true, //need to randomly rotate dominos?
    is_hashtag_form: true,     //is hashtag (or square frame) starting position?

    //board size: square side is equal to 11 cells, because 11 = 2 + 7 + 2
    board_sizes_01: [11, 11],

    //cut board to inscribe line width
    ratio_linewidth_to_gameboard_area: 0.033 / 11,

    //scale ratio to by body_width/height for text
    ratio_text_to_body_client: 0.019,

    //ratio for domino (max 0.5 - 50%)
    ratio_rounded_corners_to_rect: 0.2,

    //dots of domino defined by the ratio to the short side of domino
    grid_circle_radius: 0.08,
    //distance between centers of neighbour dots
    grid_circle_step: 0.25,

    //fill-stroke-lineWidth, that define CSS style of SVG elements "Dominos"
    DOMINO: {
        ROUND_RECTS: {
            fill: "RGB(248,255,250)",   //domino's rectangle fill color
            stroke: "RGB(0,0,0)",       //domino's rectandle stroke color
            //stroke_width defined by the ratio to the short side of domino
            ratio: 0.055,
        },

        CIRCLE_DOTS: {
            fill: "RGB(0,60,250)",     //dot's of domino fill color
            stroke: "RGB(0,0,0)",      //dot's of domino stroke color
            //stroke-width defined by ratio to the short side of domino
            ratio: 0.075
        }
    },

    ELLIPSE_HINTS: {
        fill: "RGB(120,150,190)",
        stroke: "RGB(0,0,0)",
        ratio: 0.055,
    },

    SELECTED: {
        //when domino selected (for example, hints fo legal moves), we will have this colors:
        RECTS: {
            fill: "RGB(90,255,50)",  //domino's rectangle fill color
            stroke: "RGB(0,128,0)",    //domino's rectandle stroke color
            //stroke_width defined by the ratio to the short side of domino
            ratio: 0.055,
        },

        //selected square cells (unselected are "hidden")
        SQUARES: {
            fill: "RGB(0,0,0)",
            stroke: "RGB(150,0,0)",
            ratio: 0.02,
        }
    },

    BUTTONS: {
        fill: "RGB(0,0,0)",
        stroke: "RGB(255,0,0)",
        //absolute_ratio_in_20_20_square
        ratio: 1.0
    },

    ARROW: {
        fill: "RGB(240,240,110)",
        stroke: "RGB(0,100,0)",
        ratio: 0.03,

        //points, that define form of arrow
        p_w_in: 0.35,
        p_w_base: 0.4,
        p_w_out: 0.8,

        p_h_base_cut: 0.055,
        p_h_out: 0.35,
        p_h_in: 0.4,
        p_h_end_cut: 0.95,

        stretching_in_n_times: 1.1
    }
};