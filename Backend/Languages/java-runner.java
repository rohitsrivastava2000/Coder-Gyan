import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);  // Create Scanner object

        System.out.print("Enter a number: ");
        int num = sc.nextInt();  // Read an integer

        System.out.println("You entered: " + num);  // Print the number
    }
}
