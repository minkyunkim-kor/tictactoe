<template>
  <v-app>
    <v-container ma-0 pa-0 fluid>
      <v-row class="mt-3 align-center justify-center">
        <p class="text-center font-weight-black text-h2">
          {{ title }}
        </p>
      </v-row>
      <v-row ma-5 pa-0>
        <v-col cols="9" ma-5>
          <CardPane ref="card" />
        </v-col>
        <v-col cols="3" ma-5>
          <v-row class="ma-5 pa-5" />
          <v-row class="mt-15 mb-5 mr-10" flex-column>
            <v-col cols="4">
              <v-select
                :items="levels"
                v-model="selectLevel"
                label="레벨"
                solo
                v-on:change="clickLevel()"
              />
            </v-col>
            <v-col cols="8">
              <v-select
                :items="booksList"
                v-model="selectBook"
                label="책"
                solo
                v-on:change="clickBooks()"
              />
            </v-col>
          </v-row>
          <v-divider class="mr-10" />
          <v-row class="mt-5 mb-5 mr-10">
            <v-avatar class="ma-2" color="primary" size="56" />
            <v-text-field v-model="blueTeamName" color="primary" />
          </v-row>
          <v-row class="mt-5 mb-5 mr-10">
            <v-avatar class="ma-2" color="red" size="56" />
            <v-text-field v-model="redTeamName" color="red" />
          </v-row>
          <v-divider class="mr-10" />
          <v-row class="mt-5 mb-5 mr-10">
            <v-col cols="6" align="center">
              <v-btn
                v-if="!this.$store.state.isStarted"
                color="primary"
                dark
                @click="clickStartButton"
                x-large
              >
                <v-icon x-large>mdi-play-circle</v-icon>
              </v-btn>
              <v-btn
                v-if="this.$store.state.isStarted"
                color="primary"
                dark
                @click="clickStartButton"
                x-large
              >
                <v-icon x-large>
                  mdi-pause-circle-outline
                </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="6" align="center">
              <v-btn color="warning" dark x-large @click="$refs.card.undo()">
                <v-icon x-large>mdi-undo</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="show" width="600">
      <v-card>
        <v-card-title>
          Settings
        </v-card-title>
        <v-card-text>
          <v-text-field
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required]"
            :type="showPassword ? 'text' : 'password'"
            name="input-10-2"
            :value="input"
            label="관리자 비밀번호를 입력하세요."
            v-model="input"
            class="input-group--focused"
            @click:append="showPassword = !showPassword"
            @keypress.enter="checkPassword"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="checkPassword">
            OK
          </v-btn>
          <v-btn color="red" text @click="show = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showInputForm" width="800">
      <v-card>
        <v-card-text>
          <word-input ref="input" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="clickSave">
            OK
          </v-btn>
          <v-btn color="red" text @click="showInputForm = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <button v-shortkey="['ctrl', 'alt', 's']" @shortkey="show = true" />
  </v-app>
</template>

<script>
import CardPane from "./components/CardPane";
import WordInput from "./components/WordInput";
import datasets from "./assets/datasets.json";

export default {
  name: "App",
  components: {
    CardPane,
    WordInput
  },
  computed: {
    levels() {
      return datasets.data.map(item => {
        return item.level;
      });
    }
  },
  data: () => ({
    title: "Tic-Tac-Toe",
    blueTeamName: "Blue Team",
    redTeamName: "Red Team",
    selectLevel: "",
    selectBook: "",
    booksList: [],
    input: "",
    show: false,
    showPassword: false,
    correctPassword: "c3RvcnllZHUxMzU=",
    rules: {
      required: value => !!value || "Required."
    },
    showInputForm: false
  }),
  methods: {
    clickStartButton() {
      this.$store.state.isStarted = !this.$store.state.isStarted;
      this.$store.state.blueTeamName = this.blueTeamName;
      this.$store.state.redTeamName = this.redTeamName;
    },
    clickLevel() {
      let level = this.selectLevel;
      this.booksList = datasets.data
        .filter(item => {
          if (item.level === level) {
            return item.books;
          }
        })[0]
        .books.map(book => {
          return book.name;
        });
      this.$store.state.colors = datasets.data.filter(item => {
        if (item.level === level) {
          return item.colors;
        }
      })[0].colors;
    },
    clickBooks() {
      let level = this.selectLevel;
      let books = this.selectBook;
      let words = datasets.data
        .filter(item => {
          if (item.level === level) {
            return item.books;
          }
        })[0]
        .books.filter(book => {
          if (book.name === books) {
            return book.words;
          }
        })[0].words;
      for (let i = 0; i < words.length; i++) {
        if (words[i].includes("-") && !words[i].includes("-<br/>")) {
          words[i] = words[i].replace(/-/g, "-<br/>");
        }
      }
      this.$store.state.words = this.shuffle(words);
    },
    checkPassword() {
      let encodedString = btoa(this.input);
      if (encodedString === this.correctPassword) {
        this.input = "";
        this.show = false;
        this.showInputForm = true;
      } else {
        this.input = "";
      }
    },
    clickSave() {
      this.$refs.input.save();
      this.showInputForm = false;
    },
    shuffle(array) {
      var currentIndex = array.length,
        temporaryValue,
        randomIndex;

      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }
  }
};
</script>

<style>
html {
  overflow-y: hidden;
}
</style>
