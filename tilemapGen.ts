//% icon="\uf247" color="#60007D"
namespace tilegen {

    //  Given an X and Y size, returns the data that
    //  is retuned whenever you load an empty tilemap
    //  of said size. See tilemap.g.ts in the Explorer 
    //  to see how that works for a normal tilemap.

    export let tileScale = TileScale.Sixteen
    
    //% blockId=tilegenGenerateTilemap 
    //% block="generate tilemap with $tilelist width $width height $height data array %list wall image %wallImage"
    //% tilelist.shadow=tilemapGenGetTilelist
    //% width.defl=16
    //% height.defl=16
    //% wallImage.shadow=screen_image_picker
    //% inlineInputMode=inline
    export function genTilemap(tilelist: Image[], width: number = 16, height: number = 16, tileData: number[] = [], wallImage: Image = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `) {

        //  This section sets up a list with the same format used when making the hex data of the tilemap, which stores the info about which tile is in each spot.

        let list = [width, 0, height, 0] // Size info comes first and requires separation

        if (tileData == []) {
            for (let i = 0; i < (width * height); i++) { // Adds the rest of the tilemap data.

                list.push(0) // Pushing 0 fills the tilemap with the tile "transparency16"
            }
        } else {
            for (let i = 0; i < tileData.length; i++) {

                list.push(tileData[i])
            }
        }

        let buffer = Buffer.fromArray(list) // Makes a buffer out of the list.

        return (tiles.createTilemap(buffer, wallImage, tilelist, tileScale))    // Can be changed to .Eight for 8x8 tiles, but you also have to have the Arcade-tile-util extension and have created a 8x8 tilemap with it before.
    }

    export class map {

        static maps: map[] = []
        static tilelist: Image[] = []

        _id: number
        _height: number
        _width: number
        _data: number[]
        _wallImage: Image
        _tilemap: tiles.TileMapData

        constructor(id: number, width: number, height: number, data: number[], wallImage: Image) {
            this._id = id
            this._width = width
            this._height = height
            this._data = data
            this._wallImage = wallImage

            this.reGenTilemap()
        }
        
        //% group="saved maps" blockSetVariable="tilegenMap"
        //% blockCombine block="width" callInDebugger
        set width(width: number) {
            this._width = width
            this.reGenTilemap()
        }

        get width() {
            return this._width
        }

        //% group="saved maps" blockSetVariable="tilegenMap"
        //% blockCombine block="height" callInDebugger
        set height(height: number) {
            this._height = height
            this.reGenTilemap()
        }

        get height() {
            return this._height
        }

        //% group="saved maps" blockSetVariable="tilegenMap"
        //% blockCombine block="map data array" callInDebugger
        set data(data: number[]) {
            this._data = data
            this.reGenTilemap()
        }

        get data() {
            return this._data
        }
        
        set wallImage(wallImage: Image) {
            this._wallImage = wallImage
            this.reGenTilemap()
        }

        get wallImage() {
            return this._wallImage
        }

        //% group="saved maps" blockSetVariable="tilegenMap"
        //% blockCombine block="id" callInDebugger
        set id(id: number) {
            this._id = id
        }
        
        get id() {
            return this._id
        }

        //% group="saved maps" blockSetVariable="tilegenMap"
        //% blockCombine block="tilemap" callInDebugger
        set tilemap(tilemap: tiles.TileMapData) {
            this._tilemap = tilemap
        }

        get tilemap() {
            return this._tilemap
        }

        reGenTilemap() {
            while (this._data.length < this._width * this._height) {
                this._data.push(0)
            }
            this._tilemap = tiles.createTilemap(Buffer.fromArray([this.width, 0, this.height, 0].concat(this._data)), this._wallImage, map.tilelist, tileScale)
        }
    }

    //% blockId=tilemapGenFindMapWithName
    //% block="map with id $id"
    export function findMap(id: number = 0) {
        for (let m of map.maps) {
            if (m.id == id) return m
        }
        return null
    }

    //% blockId=tilemapGenMapWithIdExists
    //% block="map with id $id exists"
    export function mapExists(id: number) {
        for (let m of map.maps) {
            if (m.id == id) return true
        }
        return false
    }

    //% blockId=tilemapGenCreateTilemapWithId
    //% block="add tilemap with id $id width $width height $height data array $data wall image %wallImage"
    //% width.defl=16
    //% height.defl=16
    //% wallImage.shadow=screen_image_picker
    //% inlineInputMode=inline
    export function addMap(id: number, width: number = 16, height: number = 16, data: number[] = [], wallImage: Image) {
        map.maps.push(new map(id, width, height, data, wallImage))
    }

    //% blockId=tilemapGenAddTileToTilelist
    //% block="add tile %tile to tilelist"
    //% tile.shadow=screen_image_picker
    export function addTile(tile: Image) {
        map.tilelist.push(tile)
    }

    //% blockId=tilemapGenSetTilelist
    //% block="set tilelist to image array %list"
    export function setTilelist(tiles: Image[] = []) {
        map.tilelist = tiles
    }

    //% blockId=tilemapGenGetTilelist
    //% block="tilelist"
    export function tilelist() {
        return map.tilelist
    }

    //% blockId=tilemapGenGetNormalTilemapTilelist
    //% block="get normal tilemap $tilemap tilelist"
    export function getNormalTilemapTilelist(tilemap: tiles.TileMapData) {
        return tilemap.getTileset()
    }

    //% blockId=tilemapGenGetNormalTilemapDataArray
    //% block="get normal tilemap $tilemap data array"
    export function getNormalTilemapData(tilemap: tiles.TileMapData) {
        return tilemap['data'].toArray(NumberFormat.UInt8LE).slice(4)
    }

    //% blockId=tilemapGenGetNormalTilemapWallImage
    //% block="get normal tilemap $tilemap wall image"
    export function getNormalTilemapWallImage(tilemap: tiles.TileMapData) {
        return tilemap['layers']
    }

    //% blockId=tilemapGenGetWallImage group="saved maps"
    //% block="get $tilegenMap=variables_get(tilegenMap) wall image"
    export function getWallImage(tilegenMap: map) {
        return tilegenMap.wallImage
    }

    //% blockId=tilemapGenSetWallImage group="saved maps"
    //% block="set $tilegenMap=variables_get(tilegenMap) wall image to $wallImage" 
    //% wallImage.shadow=screen_image_picker
    export function setWallImage(tilegenMap: map, wallImage: Image) {
        tilegenMap.wallImage = wallImage
        tilegenMap.reGenTilemap()
    }
    
    // code from Richard on the Makecode Formum: https://forum.makecode.com/t/saving-a-60-60-tilemap/40586/8?u=woofwoof
    
    /**
     * Code by Richard!
     */
    //% blockId=tilemapGenSaveTilemap
    //% block="save tilemap $tilemap as $name"
    //% group="save with settings"
    export function saveTilemap(name: string, tilemap: tiles.TileMapData) {
        settings.writeBuffer(name + "-data", (tilemap as any).data);
        saveImage(name + "-layers", (tilemap as any).layers);

        const tileset = tilemap.getTileset();
        const tileByteLength = byteHeight(4, tileset[0].height) * tileset[0].width + 8
        const tilesetByteLength = tileByteLength * tileset.length;

        const tilesetBuffer = control.createBuffer(tilesetByteLength + 1);
        tilesetBuffer[0] = tileset.length;

        for (let i = 0; i < tileset.length; i++) {
            const offset = 1 + i * tileByteLength;
            tilesetBuffer.write(offset, imageToBuffer(tileset[i]));
        }

        settings.writeBuffer(name + "-tileset", tilesetBuffer);
        settings.writeNumber(name + "-scale", tilemap.scale);
    }

    //% blockId=tilemapGenReadTilemap
    //% block="tilemap with name $name"
    //% group="save with settings"
    export function readTilemap(name: string) {
        const tilesetBuffer = settings.readBuffer(name + "-tileset");
        const tilesetLength = tilesetBuffer[0]
        const tileByteLength = (tilesetBuffer.length - 1) / tilesetLength;

        const tileset: Image[] = [];
        for (let j = 0; j <= tilesetLength - 1; j++) {
            const offset = 1 + j * tileByteLength
            tileset.push(bufferToImage(tilesetBuffer.slice(offset, tileByteLength)))
        }
        return new tiles.TileMapData(
            settings.readBuffer(name + "-data"),
            readImage(name + "-layers"),
            tileset,
            settings.readNumber(name + "-scale")
        )
    }

    function saveImage(name: string, image: Image) {
        settings.writeBuffer(name, imageToBuffer(image));
    }

    function readImage(name: string) {
        return bufferToImage(settings.readBuffer(name))
    }


    function imageToBuffer(image: Image) {
        return f4EncodeImg(image.width, image.height, 4, (x, y) => image.getPixel(x, y))
    }

    function bufferToImage(buf: Buffer) {
        return image.ofBuffer(buf);
    }

    function f4EncodeImg(w: number, h: number, bpp: number, getPix: (x: number, y: number) => number) {
        const header = [
            0x87, bpp,
            w & 0xff, w >> 8,
            h & 0xff, h >> 8,
            0, 0
        ];

        const out = control.createBuffer(header.length + byteHeight(bpp, h) * w);

        for (let k = 0; k < header.length; k++) {
            out[k] = header[k];
        }

        let index = header.length;
        let ptr = 4
        let curr = 0
        let shift = 0

        let pushBits = (n: number) => {
            curr |= n << shift
            if (shift == 8 - bpp) {
                out[index] = curr;
                index++;
                ptr++
                curr = 0
                shift = 0
            } else {
                shift += bpp
            }
        }

        for (let l = 0; l < w; ++l) {
            for (let m = 0; m < h; ++m)
                pushBits(getPix(l, m))
            while (shift != 0)
                pushBits(0)
            if (bpp > 1) {
                while (ptr & 3)
                    pushBits(0)
            }
        }

        return out
    }

    function byteHeight(bpp: number, height: number) {
        if (bpp == 1) {
            return (height + 7) >> 3
        } else {
            return ((height * 4 + 31) >> 5) << 2
        }
    }
}