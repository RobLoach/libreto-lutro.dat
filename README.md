# libretro-lutro.dat

A DAT file containing [Lutro](https://github.com/libretro/libretro-lutro) games for [RetroArch](http://www.libretro.com/).

## Usage

1. Download any `.lutro` file to your games directory
2. Scan the folder with RetroArch

## Build

1. Install [Node.js](https://nodejs.org/en/) >= 4

2. Prepare git submodule
    ```
    git submodule init
    git submodule update
    ```

2. Run `npm install` to install dependendencies

3. Run `npm test` to build the `games` directory and [`Lutro.dat`](Lutro.dat)
