import secrets

def generate_jwt_secret():
    return secrets.token_hex(32)

if __name__ == "__main__":
    jwt_secret = generate_jwt_secret()
    print(jwt_secret)
