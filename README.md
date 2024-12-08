# Visual Studio Code support for Niva language

<img align="center" width="96px" height="96px" src="niva-icon.webp" />

### 1) build vaLSe(niva lang server) from source
1) `git clone https://github.com/gavr123456789/vaLSe.git`
2) run `./gradlew installDist` there
3) copy path to `vaLSe/build/install/nivals/bin/nivals` binary, you will need it later

### 2) Install ext
1) Search "niva" in marketplace and install
2) Go to extension's settings and insert path to nivals binary 
![image](https://github.com/user-attachments/assets/9115b46f-388a-4ec3-b1fd-01eb89041e03)
3) open folder which contais main.niva file and try it out
![image](https://github.com/user-attachments/assets/474ce629-c54e-46e5-a269-c62e45cd3b4a)
Install ext

!!! `main.niva` is entry point, your folder should contain it somewhere !!!

## Read the [tutorial](https://gavr123456789.github.io/niva-site/reference.html)


## Features include:
- Code completion
- Go-to-definition
- Errors reporting
- Documentation hover
- Types hover
- Function signature provider
- Document symbols provider

### Auto-complete of messages with args-type-holes
https://github.com/user-attachments/assets/6d5a74da-f71d-4caf-9dae-e8245457628f

### Go to definitions(types and messages only, for now)
https://github.com/user-attachments/assets/6316bc45-3ce8-4c0b-8daf-685fa8a6e726

### On hover types
https://github.com/user-attachments/assets/eb55f6ef-d267-471f-b790-db5c34065c3d



### Errors reporting
[Screencast_from_2024-06-09_18-39-28.webm](https://github.com/user-attachments/assets/93878de0-4a6d-4ae3-8f7a-91ccc76fe83b)

### Document symbols provider
https://github.com/user-attachments/assets/3c7fde92-c316-4b71-b3af-c89735c904a2

### Document symbols provider from doc-comments
https://github.com/user-attachments/assets/adfe0086-6841-4f7d-9eed-40160aba43ca

### Suggest type names with constructors
https://github.com/user-attachments/assets/0fe21432-9e76-4b86-8438-b7198956c549

### You can run tests(not LSP related)
[Screencast_from_2024-05-12_16-24-22.webm](https://github.com/user-attachments/assets/33dac842-0148-4c09-818b-9c03ee3ed1f5)

### One more example
[Screencast_from_2024-05-21_16-37-16 (1).webm](https://github.com/user-attachments/assets/31c0acad-fcd7-4854-afba-51294c90a525)


To compile run `npm run compile`
Note for me: `vsce publish minor`
