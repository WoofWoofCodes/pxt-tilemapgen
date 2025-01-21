//% icon="\uf185" color="#8f1fff"
namespace tileGen {

    //  Given an X and Y size, returns the data that
    //  is retuned whenever you load an empty tilemap
    //  of said size. See tilemap.g.ts in the Explorer 
    //  to see how that works for a normal tilemap.

    class map {

        static maps: map[] = []

        
        //%block
        //%group="GeneratingTilemaps"
        //%blockid=tileGenGenerateTilemap block="generate tilemap with width %SizeX and height %SizeY || and data %data"
        //%width.defl=16
        //%height.defl=16
        MakeTilemap(SizeX: number, SizeY: number, data: Number[] = []) {
            //  This section sets up a list with the same format
            //  used when making the hex data of the tilemap, 
            //  which stores the info about which tile is in each spot.

            let list = [SizeX, 0, SizeY, 0] // Size info comes first and requires separation

            if (data == []) {
                for (let i = 0; i < (SizeX * SizeY); i++) { // Adds the rest of the tilemap data.

                    list.push(0) // Pushing 0 fills the tilemap with the tile "transparency16"
                } 
            }               // because that is the first tile defined on line 23.
            let buffer = Buffer.fromArray(list) // Makes a buffer out of the list.

            return (tiles.createTilemap(buffer, // Finally, everything is bundled and returned correctly!
            image.create(SizeX, SizeY),
            [],                   // or they won't be placable in the tilemap!!! 
            TileScale.Sixteen))  // Can be changed to .Eight for 8x8 tiles, but "transparency16" must be changed to "transparency8" on line 23
        }                         // You also have to have the Arcade-tile-util extension and have created a 8x8 tilemap with it before.

    //tiles.setCurrentTilemap(MakeTilemap(10, 10)) // Generates the tilemap!
    }
}
