# @greenbotics/plant-together


> Experimental companion plant helper cli tool to help you out with garden planning

A LOT OF THE THINGS HERE CAN AND WILL CHANGE!! This softare is pre-alpha, use at your own risk etc !

## Overview

- finding companion plant is not trivial , once you start combining multiple plant types/species
- this tool enables you to find plants that grow well together usin an input csv table listing plant name, friend , fiend columns 
- the tools also looks for incompatibilities BETWEEN the companion plants, and warns you about any issues
- it is meant to be minimal (command line tool), simple & fast 


## Table of Contents

- [Installation](#installation)
- [Usage](#usage)

## Installation

```
npm install -g @greenbotics/plant-together

```

## Usage

For now just type node src/index xxxx
- friend: 

example : find all friendly/ good plants in the input list, using  "./data/assoc-plants1.csv" as the input data set

```
node src/index.js -f "./data/assoc-plants1.csv" friend chou romarin persil brocoli laitue
```

- list : display a list of all available plants within the current dataset

example :
```
node src/index.js list
```

## License

[The MIT License (MIT)](./LICENSE)
(unless specified otherwise)
