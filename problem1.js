var sum_to_n_a = function(n) {
    if (n == 1) {
        return 1
    } else {
        return n + sum_to_n_a(n-1);
    }
};

var sum_to_n_b = function(n) {
    i = n;
    total = 0;
    while (i != 0) {
        total += i;
        i -= 1;
    }
    return total;
};

var sum_to_n_c = function(n) {
    return (n * (n+1))/2
};

console.log(sum_to_n_a(7))
console.log(sum_to_n_b(7))
console.log(sum_to_n_c(7))
