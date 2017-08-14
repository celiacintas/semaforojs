# Semáforo Contador para Competencia de Robótica [*]

En Chrome no se pueden cargar por XHR los sonidos, por lo tanto la forma de ejecutarlo es:

```bash
twistd -n web --path=.
```

O en su defecto:

```bash
python2 -m SimpleHTTPServer
````

o alternativamente:

```bash
python3 -m http.server
```

[*]: http://robocomp.dit.ing.unp.edu.ar/