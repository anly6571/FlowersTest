import { isArray } from "lodash";
import * as d3 from "d3";
import * as _ from "lodash";
import "./styles.css";
//var _ = require('lodash');

// --- GLOBAL ---
let petalSize = 50;
//add petal to petal div
let petalPath = "M 0,0 C -10, -10 -10, -40 0, -50 C 10, -40 10, -10, 0,0";
// document.querySelector(".vis").innerHTML = `
// <svg width="50" height="50" fill="red"><path transform="translate(25,50)"d="${petalPath}"></svg>
// `;



// --- FUNCTIONS ---
function loadData() {
  const data = d3.csv("data/FakeData.csv", type).then((res) => {
    ready(res);
  });

  // type conversion
  function type(d) {
    return {
      county: d.County,
      energy: +d.PercentRenewable,
      ghg: +d.GHG,
      transit: +d.GreenTransit
    };
  }
}

function ready(data) {
  //
  // Scales
  //const svg = DOM.svg(petalSize * 2, petalSize*2);
  const energyMinMax = d3.extent(data, (d) => d.energy);
  const ghgMinMax = d3.extent(data, (d) => d.ghg);
  const sizeScale = d3.scaleLinear().domain(energyMinMax).range([0.25, 1]); //size mapped to energy
  const numPetalScale = d3.scaleQuantize().domain(ghgMinMax).range([5, 7, 10]); //number mapped to ghg

  // Base moved below to drawFlower
  // const svg = d3
  //   .select('.vis')
  //   .append('svg')
  //   .attr('width', 500)
  //   .attr('height', 500)
  //   .append('g')

  // Draw Flowers
  // svg
  //   .append('g')
  //   .attr('class', 'flowers')
  //   .selectAll('.flower')
  //   .data(data)
  //   .enter()
  //   .append('path')
  //   .attr('class', 'flower')
  //For each flower whaa?
  //.for(SCALEMOD, INPUT)
  // DRAW EACH PETAL ROTATED
  // Scale Order?
  //

  data.forEach((f, i) => {
    drawFlower(f, i, sizeScale, numPetalScale);
  });
}

function drawFlower(flower, index, sizeScale, numScale) {
  //const boulderData = 1; //index of Boulder data
  //console.log(data)

  //base svg
  const svg = d3
    .select(".vis")
    .append("svg")
    .attr("width", petalSize * 2)
    .attr("height", petalSize * 2)
    .append("g");

  const numPetals = numScale(flower.ghg); //calls function to calc num petals for boulder
  const size = sizeScale(flower.energy);
  const oneFlower = {
    size,
    petals: _.times(numPetals, (i) => {
      return { angle: (360 * i) / numPetals, petalPath };
    })
  };

  console.log(`Petals: ${numPetals}, size: ${size}`);

  //D3 draw the individual flower

  const flowers = d3
    .select("svg")
    .selectAll("g")
    .data([oneFlower])
    .enter()
    .append("g")
    .attr(
      "transform",
      (d) => `translate($petalSize},${petalSize})scale(${d.petSize})`
    ) //changes size of the flower/group
    .style("fill", "blue");

  flowers
    .selectAll("path") //for each flower select all of the paths
    .data((d) => d.petals)
    .enter()
    .append("path") //returns array of petals from above
    .attr("d", (d) => d.petalPath)
    .attr("tranform", (d) => `rotate(${d.angle})`)
    .style("fill", "blue");

  return svg;
}

// --- FLOW ---
loadData();

//Loads data, console logs it as an array of objects
//const svg = DOM.svg(petalSize * 2, petalSize * 2);
//create one flower
