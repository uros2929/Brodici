1. 2 igrača igraju na 2 tabele 10x10 numerisane sa a-j horizontalno i 1 do 10 vertikalno
Na njih treba da rasporede oblike: 
xxxx
xxx x 

- jedan igra pa sledeći igra ( ne može isti 2x zaredom), ako je pogodio može ponovo
- kad ga potopiš treba da se prikaže da je potopljen (ako si pogodio 2 od 2), obeležava sva okolna polja
- za svaki pokušaj treba da ti pokaže da li si pogodio
- U dozvoljenom vremenu moramo da postavimo brodiće, ako ih ne postavimo izgubili smo i to se čuva u istoriji
- random ko prvi igra 
- i za odigravanje poteza ima limit
- može i za odigravanje poteza i za postavljanje figura umesto da mu se kaže da je izgubio da se odigra random
- ne smeju da se dodiruju

Ajax pozivi:
- nova igra: pravi prazne table (na serveru će se računati vreme)
- šaljemo naše pozicije na server (na serveru proverava da li su pozicije stigle u određenom vremenu, ako nisu ovde mu javlja da je izbugio ako je drugi već poslao)
- provera da li je drugi igrao: 
- slanje našeg poteza: slovo i broj - vraća pogodjen, potopljen, promašen
- 
- 