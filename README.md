# DMR-Contact-list
NODE JS script for DMR radio contactlists auto fill

Should get latest dmr-id contacts from radioid.net, Ukraine only
Then convert contacts to .csv radio specific format  

Supports formats from radio:

**Anytone 878 UV II plus**
**TYT MD-9600**
**RETEVIS RT90**

# Requirements

1. Download Node JS v18.XX.XX LTS from [the official Node.js website](https://nodejs.org/en/download/package-manager)
2. Install Node JS and open a terminal in the project folder
3. Install dependencies
`npm install`

# How to use

Just run script
`npm start`

# How to customize

Modify the main file to switch the radio format.
You can create your own formats, for this add support for the new format in the combiner.js file following the comments in the code.
