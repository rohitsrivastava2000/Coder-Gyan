#include <iostream>
using namespace std;

int areaOfRectangle(int length,int breath){
    return length*breath;
}

int main() {
    int l,b;
    cin>>l>>b;
    cout<<"Area of rectangle is : ";
    cout<<areaOfRectangle(l,b); 
    
    return 0;
    
}
