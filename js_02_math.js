//global object for game
var G = {};

//classical domino set (28 from 00 to 66)
G.DOMINO = {
    //dots in square 3*3 for vertical and horizontal 0..6 domino square
    ARR_DOTS_SHOW: [
        [[], [4], [6, 2], [6, 4, 2], [0, 2, 8, 6], [0, 2, 8, 6, 4], [0, 2, 3, 5, 6, 8]],
        [[], [4], [6, 2], [0, 4, 8], [0, 2, 8, 6], [0, 2, 8, 6, 4], [0, 1, 2, 6, 7, 8]]
    ],

    //nine slots for dots 00 - center from 0 to 8
    ARR_DX_DY_SQUARE: [[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]],

    //all 28 dominos from 00 to 66
    ARR_SET_28: [
        [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [2, 2],
        [2, 3], [2, 4], [2, 5], [2, 6], [3, 3], [3, 4], [3, 5], [3, 6], [4, 4], [4, 5], [4, 6], [5, 5], [5, 6], [6, 6]
    ],

    //all doubled dominos (1 if index of double), the are 7 units and 21 zeros in the array of 28
    ARR_IS_DOUBLE: [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1]
};


G.MATH = {
    //delete zeros at the end of decimal number, that will be writtens as string
    f_n_to_string: function (r, n_digits) {
        //special case is when real nubmer is integer
        if (r == r.toFixed(0)) { return (r + '') };

        //if n_digits is UNDEFINED default value = 2
        var s = r.toFixed((n_digits !== undefined) ? n_digits : 2) + '';

        //delete final zeros of non-integer decimal fraction
        while (s.slice(-1) === '0') { s = s.slice(0, -1) };

        //check, that it is no final dot
        if(s.slice(-1) === '.') { s = s.slice(0, -1) };

        //final result will be string without unUsed final zeros (at he end, like 3.250000)
        return s;
    },

    //return elements id (from ID_00 to ID_66) by array of 2 digits 0..6 
    f_id_by_n06n06: function (arr_00_to_66) { return ('ID_' + arr_00_to_66[0] + arr_00_to_66[1]); },
    //return id by index 0..27
    f_id_by_n28: function (i28) {return G.MATH.f_id_by_n06n06(G.DOMINO.ARR_SET_28[i28]); },
    //return id of xy, for example: [5,10] = "ID_5_10"
    f_id_of_cell_by_arr_nx_ny: function (arr_01) {return 'ID_' + arr_01[0] + '_' + arr_01[1]; },

    //random integer number in [0..n-1]
    f_random_n: function (n_variants) { return Math.floor(Math.random() * n_variants); },
    //random integer in [na .. nb), that means [na .. nb - 1]
    f_random_a_b: function (na, nb_not_inclusive) { return (G.MATH.f_random_n(nb_not_inclusive - na) + na); },

    //generate array [0..len-1] by values [f(0), f(1), f(2), ... f(len-1)]
    f_gen_array_by_function: function (len, f) {
        var a = []; for (var i = 0; i < len; i++) { a.push(f(i)); }; return a;
    },

    //array 0,1,2, ... , len-1
    f_order_perm: function (len) {
        return G.MATH.f_gen_array_by_function(len, function (n) { return n; });
    },

    //random permutation by Fisher–Yates shuffle
    f_random_perm: function (len) {
        var t, rand, perm = G.MATH.f_order_perm(len);
        for (var i = 0; i < (len - 1); i++) {
            //random from current index to the final index [i..len-1]
            rand = G.MATH.f_random_a_b(i, len);
            //swap ttwo values in the permutation array: (perm[i], perm[random])
            t = perm[i]; perm[i] = perm[rand]; perm[rand] = t;
        }
        return perm;
    }
};