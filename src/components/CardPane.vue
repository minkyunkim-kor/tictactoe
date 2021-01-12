<template>
  <v-container fluid>
    <v-sheet v-bind:color="backgroundColor" rounded="xl" class="pa-3 ml-5 mr-0">
      <v-row align="center" justify="center" class="ma-0 pa-0" dense>
        <v-col align="center" justify="center" dense cols="1">
          <v-card
            class="d-flex align-center justify-center"
            :width="minWidth"
            :height="minHeight"
            elevation="0"
            v-bind:color="backgroundColor"
            cols="1"
          />
        </v-col>
        <v-col v-for="j in 6" :key="j" align="center" justify="center" dense>
          <v-card
            class="d-flex align-center justify-center"
            elevation="0"
            v-bind:color="backgroundColor"
            v-text="numberToAlpha(j - 1)"
          />
        </v-col>
      </v-row>
      <v-row
        v-for="i in 6"
        :key="i"
        align="center"
        justify="center"
        class="ma-0 pa-0"
        dense
      >
        <v-col align="center" justify="center" dense cols="1">
          <v-card
            class="d-flex align-center justify-center"
            :width="minWidth"
            :height="maxHeight"
            elevation="0"
            v-bind:color="backgroundColor"
            v-text="i"
          />
        </v-col>
        <v-col v-for="j in 6" :key="j" align="center" justify="center" dense>
          <v-btn
            class="d-flex align-center justify-center black--text"
            style="font-size: 18px;"
            :height="maxHeight"
            :width="maxWidth"
            v-on:click="clickWord((i - 1) * 6 + (j - 1))"
            v-bind:color="selected[(i - 1) * 6 + (j - 1)]"
            v-html="wordsData[(i - 1) * 6 + (j - 1)]"
          />
        </v-col>
      </v-row>
    </v-sheet>
    <v-dialog v-model="alert" width="300">
      <v-card>
        <v-card-title>
          {{ alertTitle }}
        </v-card-title>
        <v-card-actions class="ma-0 pa-0">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="
              alert = false;
              if (isEnd) gameset(true);
            "
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "CardPane",
  computed: {
    wordsData() {
      return this.$store.state.words;
    },
    backgroundColor() {
      return this.$store.state.colors;
    }
  },
  data: () => ({
    selected: new Array(36).fill("white"),
    turn: 0,
    clickIndex: new Array(36).fill(0),
    alertTitle: "",
    alert: false,
    isEnd: false,
    maxWidth: window.innerWidth / 20,
    maxHeight: window.innerHeight / 15,
    minWidth: window.innerWidth / 60,
    minHeight: window.innerHeight / 40
  }),
  methods: {
    numberToAlpha(num) {
      return String.fromCharCode(num + 65);
    },
    clickWord(index) {
      if (this.$store.state.isStarted) {
        if (this.selected[index] === "white") {
          this.selected[index] = (this.turn + 1) % 2 === 1 ? "primary" : "red";
          this.clickIndex[this.turn] = index;
          this.turn = this.turn + 1;
          this.$forceUpdate();
        } else {
          this.alertTitle = "이미 선택된 버튼입니다.";
          this.alert = true;
        }
        const winning = this.checkWinning(index);
        console.log(winning);
        if (winning.result) {
          this.alertTitle = "승자는 " + winning.winner + " 입니다.";
          this.alert = true;
          this.isEnd = true;
        }
      } else {
        this.alertTitle = "게임을 시작해주세요!";
        this.alert = true;
      }
    },
    undo() {
      this.turn = this.turn - 1;
      this.selected[this.clickIndex[this.turn]] = "white";
      this.clickIndex[this.turn] = 0;
      this.$forceUpdate();
    },
    gameset(isEnd) {
      if (isEnd) {
        this.selected = new Array(36).fill("white");
        this.clickIndex = new Array(36).fill(0);
        this.turn = 0;
        this.$forceUpdate();
        this.$store.state.isStarted = false;
      }
    },
    checkWinning(index) {
      if (this.turn < 7) {
        return { result: false, winner: "" };
      }
      let row = Math.floor(index / 6);
      let col = index % 6;
      // 1st. 가로 확인
      for (let r = 0; r < (col < 2 ? col + 1 : 3); r++) {
        let i = row * 6 + r;
        if (
          this.selected[i] === this.selected[i + 1] &&
          this.selected[i] === this.selected[i + 2] &&
          this.selected[i] === this.selected[i + 3] &&
          this.selected[i] !== "white"
        ) {
          return {
            result: true,
            winner:
              this.selected[i] === "primary"
                ? this.$store.state.blueTeamName
                : this.$store.state.redTeamName
          };
        }
      }

      // 2nd 세로 확인
      for (let c = 0; c < (row < 2 ? row + 1 : 3); c++) {
        let i = c * 6 + col;
        if (
          this.selected[i] === this.selected[i + 6] &&
          this.selected[i] === this.selected[i + 12] &&
          this.selected[i] === this.selected[i + 18] &&
          this.selected[i] !== "white"
        ) {
          return {
            result: true,
            winner:
              this.selected[i] === "primary"
                ? this.$store.state.blueTeamName
                : this.$store.state.redTeamName
          };
        }
      }

      // 3nd 대각선 확인
      for (let i = 3; i < 21; i += 6) {
        for (let j = 0; j < 3; j++) {
          let index = i + j;
          if (
            this.selected[index] === this.selected[index + 5] &&
            this.selected[index] === this.selected[index + 10] &&
            this.selected[index] === this.selected[index + 15] &&
            this.selected[index] !== "white"
          ) {
            return {
              result: true,
              winner:
                this.selected[index] === "primary"
                  ? this.$store.state.blueTeamName
                  : this.$store.state.redTeamName
            };
          }
        }
      }
      for (let i = 0; i < 18; i += 6) {
        for (let j = 0; j < 3; j++) {
          let index = i + j;
          if (
            this.selected[index] === this.selected[index + 7] &&
            this.selected[index] === this.selected[index + 14] &&
            this.selected[index] === this.selected[index + 21] &&
            this.selected[index] !== "white"
          ) {
            return {
              result: true,
              winner:
                this.selected[index] === "primary"
                  ? this.$store.state.blueTeamName
                  : this.$store.state.redTeamName
            };
          }
        }
      }

      return {
        result: false,
        winner: ""
      };
    }
  }
};
</script>

<style>
.disable-events {
  pointer-events: none;
}
</style>
