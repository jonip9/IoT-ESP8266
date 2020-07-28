# ESP8266 IoT-projekti

## Kuvaus

Frontend IoT-kouluprojektille, jossa ESP8266-moduuli mittaa ympäristön lämpötilan ja kosteuden, lähettää ne [Thinger.io](https://thinger.io/)-palveluun, josta tämä sovellus sitten hakee viimeisimmät tiedot ja näyttää ne käyttäjälle. Projekti oli ryhmätyö, mutta frontendin toteutus oli kokonaisuudessaan minun vastuulla.

Sovelluksessa käyttäjä voi lisätä laitteita pohjapiirroksen päälle ja siirtää niitä haluamaansa paikkaan. Näytettävä  tieto päivittyy laitekohtaisesti automaattisesti tietyin väliajoin. Käyttäjä voi tallentaa laitteen sijainnin pohjapiirroksessa, jolloin se tallentuu erilliseen MongoDB-palvelimeen. Sivun latautuessa tallennetut laitteet haetaan palvelimelta ja näytetään oikeilla paikoillaan.

### Merkittävimmät kolmannen osapuolen kirjastot

- [react-draggable](https://github.com/STRML/react-draggable)
- [reactstrap](https://reactstrap.github.io/)

### Kokeile!

https://r2iotproject.azurewebsites.net/

Sovellus on hostattuna Microsoftin Azure-palvelussa sellaisessa tilanteessa kuin se palautuksen aikana oli. Palvelin voi joskus olla todella hidas, odota rauhassa.
**Huom!** Laitteet on palautettu koululle ja muut palvelimet ajettu alas, joten varsinainen tiedon haku ja tallennus ei siis enää toimi.
