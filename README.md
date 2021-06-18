# picture-sort
A Electron app to sort a folder with pictures into good bad and not sure folders


## Preview

![Image of GUI](https://github.com/Matts-vdp/picture-sort/blob/main/pics/Screenshot.png)

## installation
When using the unpackaged version you have to install the needed dependencys first these can be found in package.json.
If you want a prepackaged version see the releases tab.
The release is compacted in a zip file to reduce file size. To use the program you have to unzip this folder.

## Usage
### Choose folder
When you launch the application this window will appear.

![Image of GUI](https://github.com/Matts-vdp/picture-sort/blob/main/pics/Screenshot2.png)

To select a folder you want to sort you click on the click here image.
You will then be asked to select a folder.
When the folder is selected and the program has found .png or .jpg files inside 
the buttons will enable and the first image will be visible like in the preview image.

### Sort pictures
The different buttons with there respective hotkeys are:
* Good: right arrow
* Not sure: down arrow
* Bad: left arrow
When a button or hotkey is pressed the application will scroll to the next image.

### File handeling
Inside the chosen folder a Good, Bad and a Not-sure folder will be created.
When a button or hotkey is pushed the image will be put in the respective folder.

#### Important information
**Images will be copied from there original location to the chosen location, this to make sure no images get lost when a error occurs.**

