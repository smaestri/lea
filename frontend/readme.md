Project structure taken from
https://github.com/justin-calleja/webpack-mvn

PREREQUISITES
To test in connected mode,
- choose a correct userId in index.html (frontend side)
- desactivate spring security : just comment .anyRequest().authenticated()
- desactiva csrf .csrf().disable()
- change commoncontroller to return same user as defined in index.html



LAUNCH
npm run serve
go to localhost:3333


