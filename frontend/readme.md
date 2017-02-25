Project structure taken from
https://github.com/justin-calleja/webpack-mvn

PREREQUISITES
To test in connected mode,
- choose a correct userId in index.html (frontend side)
- desactivate spring security : just comment .anyRequest().authenticated()
- change commoncontroller to return same user as defined in index.html

TODO :

- delete userId in index.html : should be possible to not have thie information front side