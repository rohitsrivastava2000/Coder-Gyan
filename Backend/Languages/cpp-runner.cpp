#include <iostream>
#include <vector>
using namespace std;

bool isPrimeUsingSieve(int n) {
    if (n < 2) return false;

    // Create a boolean array "isPrime[0..n]" and initialize all entries as true
    vector<bool> isPrime(n + 1, true);
    isPrime[0] = isPrime[1] = false;

    // Sieve of Eratosthenes
    for (int i = 2; i * i <= n; ++i) {
        if (isPrime[i]) {
            for (int j = i * i; j <= n; j += i)
                isPrime[j] = false;
        }
    }

    return isPrime[n];
}

int main() {
    int num;
    cout << "Enter a number: ";
    cin >> num;

    if (isPrimeUsingSieve(num))
        cout << num << " is a prime number.\n";
    else
        cout << num << " is not a prime number.\n";

    return 0;
}
