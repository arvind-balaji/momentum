<template>
  <v-container fluid>
    <v-row class="text-center">
      <v-col class="mb-5" cols="12"> <div id="map"></div> </v-col>
    </v-row>
    <v-footer
      ><v-slider :max="max" v-model="scrubber" label="Timeline"></v-slider
    ></v-footer>
  </v-container>
</template>

<script>
import video2 from "./video2_analyzed.json";
import video3 from "./video3_analyzed.json";
import video4 from "./video4_analyzed.json";
import video5 from "./video5_analyzed.json";
import video6 from "./video6_analyzed.json";
import video7 from "./video7_analyzed.json";
import demo from "./demo_analyzed.json";

export default {
  name: "Map",

  data() {
    return {
      videos: [video2, video3, demo, video4, video5, video6, video7],
      scrubber: 0,
      heat: null,
      map: null,
      arrows: [],
      max: 100
    };
  },

  methods: {
    updateData(val) {
      this.arrows.forEach(arrowObject => {
        arrowObject.remove();
      });
      this.arrows = [];

      console.log();
      // var IAHLat = 29.9865,
      //   IAHLng = -95.341;
      var points = [];
      var endPoints = { lat: [], long: [] };
      var startPoints = { lat: [], long: [] };
      this.videos.forEach(video => {
        if (video.data.length > this.max) this.max = video.data.length;
        video.data[val].forEach(item => {
          if (item.type == "end") {
            endPoints.lat.push(item.y);
            endPoints.long.push(item.x);
          }
          if (item.type == "start") {
            startPoints.lat.push(item.y);
            startPoints.long.push(item.x);
          }
          points.push([
            video.meta.lat + 0.001 * item.y,
            video.meta.long + 0.001 * item.x,
            item.weight
          ]);
        });

        var arrow = this.L.polyline(
          [
            [
              video.meta.lat + this.getAverageArray(startPoints.lat) * 0.001,
              video.meta.long + this.getAverageArray(startPoints.long) * 0.001
            ],
            [
              video.meta.lat + this.getAverageArray(endPoints.lat) * 0.001,
              video.meta.long + this.getAverageArray(endPoints.long) * 0.001
            ]
          ],
          {}
        ).addTo(this.map);
        var arrowHead = this.L.polylineDecorator(arrow, {
          patterns: [
            {
              offset: "100%",
              repeat: 0,
              symbol: this.L.Symbol.arrowHead({
                pixelSize: 15,
                polygon: false,
                pathOptions: { stroke: true }
              })
            }
          ]
        }).addTo(this.map);
        this.arrows.push(arrow);
        this.arrows.push(arrowHead);
      });

      this.heat.setLatLngs(points);
    },
    getAverageArray(arr) {
      console.log(arr);
      return arr.reduce((a, b) => a + b, 0) / arr.length;
    }
  },
  watch: {
    scrubber: function(val) {
      this.updateData(val);
    }
  },

  mounted() {
    var IAHLat = 29.9865,
      IAHLng = -95.341;
    this.map = this.L.map("map").setView([IAHLat, IAHLng], 17);

    this.L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // var addressPoints = this.addressPoints.map(function(p) {
    //   return [p[0], p[1]];
    // });

    //addressPoints = [[IAHLat, IAHLng, 2]];
    //
    // var points = [];
    // this.video3[0].forEach(item => {
    //   points.push([
    //     IAHLat + 0.001 * item.y,
    //     IAHLng + 0.001 * item.x,
    //     item.weight
    //   ]);
    // });

    this.heat = this.L.heatLayer([], { max: 2 }).addTo(this.map);
    var draw = true;

    this.updateData(0);
    //heat.addLatLng({ lat: IAHLat, lng: IAHLng, altitude: 1 });

    this.map.on({
      movestart: function() {
        draw = false;
      },
      moveend: function() {
        draw = true;
      },
      mousemove: function() {
        if (draw) {
          //  heat.addLatLng(e.latlng);
        }
      }
    });
  }
};
</script>
