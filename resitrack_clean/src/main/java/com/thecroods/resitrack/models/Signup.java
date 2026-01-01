import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Signup {

    @NotBlank
    private String username;

    @NotBlank
    @Size (min = 6,  max = 20)
    private String password;

    @NotBlank
    @Email
    private String email;
}
