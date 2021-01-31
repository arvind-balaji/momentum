<template>
  <v-container fluid>
    <v-row class="text-center">
      <v-col class="mb-5" cols="12"> <div id="map"></div> </v-col>
    </v-row>
    <v-slider max="310" v-model="scrubber" label="Timeline"></v-slider>
  </v-container>
</template>

<script>
import video2 from "./video2_analyzed.json";
import video3 from "./video3_analyzed.json";

export default {
  name: "Map",

  data() {
    return { videos: [video2, video3], scrubber: 0, heat: null };
  },

  methods: {
    updateData(val) {
      console.log();
      // var IAHLat = 29.9865,
      //   IAHLng = -95.341;
      var points = [];
      this.videos.forEach(video => {
        video.data[val].forEach(item => {
          points.push([
            video.meta.lat + 0.001 * item.y,
            video.meta.long + 0.001 * item.x,
            item.weight
          ]);
        });
      });

      console.log(points);
      this.heat.setLatLngs(points);
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
    var map = this.L.map("map").setView([IAHLat, IAHLng], 17);

    this.L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    console.log(this.addressPoints, "ap");

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

    this.heat = this.L.heatLayer([], { max: 2 }).addTo(map);
    var draw = true;

    this.updateData(0);
    //heat.addLatLng({ lat: IAHLat, lng: IAHLng, altitude: 1 });

    map.on({
      movestart: function() {
        draw = false;
      },
      moveend: function() {
        draw = true;
      },
      mousemove: function(e) {
        console.log(e);
        if (draw) {
          //  heat.addLatLng(e.latlng);
        }
      }
    });
  }
};
</script>
