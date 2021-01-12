<template>
  <v-container fluid>
    <v-card color="grey lighten-4" flat tile>
      <v-toolbar dense>
        <v-toolbar-title>Game Word Setting</v-toolbar-title>
        <v-spacer />
        <v-btn @click="showAddLevel = true" text primary>
          ADD LEVEL
        </v-btn>
      </v-toolbar>
      <v-expansion-panels inset>
        <v-expansion-panel v-for="(data, i) in datasets.data" :key="i">
          <v-expansion-panel-header>
            {{ data.level }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row align="center" justify="center">
              <v-col cols="4">
                <p>Select Backgroud Color</p>
              </v-col>
              <v-col>
                <v-color-picker class="ma-2" v-model="data.colors" />
              </v-col>
            </v-row>
            <v-row align="center" justify="center">
              <v-tabs center-active>
                <v-tab v-for="(book, i) in data.books" :key="i">
                  {{ book.name }}
                </v-tab>
                <v-tab-item v-for="(book, i) in data.books" :key="i">
                  <v-row align="center" justify="center">
                    <v-col cols="10">
                      <v-text-field
                        v-model="inputwords"
                        :rules="[rules.hyphen]"
                        @keyup.enter="addWord(book)"
                        required
                        :disabled="book.words.length === 36"
                      />
                    </v-col>
                    <v-col cols="2">
                      <p>({{ book.words.length }} / 36)</p>
                    </v-col>
                  </v-row>
                  <v-chip
                    v-for="(word, index) in book.words"
                    :key="word"
                    color="green"
                    outlined
                    close
                    @click:close="removeWord(book, index)"
                  >
                    {{ word }}
                  </v-chip>
                </v-tab-item>
              </v-tabs>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
    <v-dialog v-model="showAddLevel" width="200">
      <v-card>
        <v-text-field class="ma-3" v-model="newLevel" label="레벨" required />
        <v-btn color="success" class="mr-4" @click="addlevel" text>
          SAVE
        </v-btn>
        <v-btn
          color="error"
          class="mr-4"
          @click="
            showAddLevel = false;
            newLevel = '';
          "
          text
        >
          CANCEL
        </v-btn>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import datasets from "../assets/datasets.json";
import { removeFile, writeFile } from "fs-web";

export default {
  data: () => ({
    datasets: datasets,
    newLevel: "",
    showAddLevel: false,
    inputwords: "",
    rules: {
      hyphen: value =>
        value.length <= 10 ||
        (value.length > 10 && value.includes("-")) ||
        "spelling이 10자가 넘는 경우 두 줄 출력을 위해 -을 중간에 넣어주세요"
    }
  }),
  methods: {
    addlevel() {
      this.datasets.data.push({
        level: this.newLevel,
        colors: "#000000",
        books: this.generateInitBooks()
      });
      this.newLevel = "";
      this.showAddLevel = false;
    },
    generateInitBooks() {
      let result = [];
      for (let i = 1; i <= 8; i++) {
        for (let j = 1; j <= 2; j++) {
          result.push({
            name: i + "-" + j,
            words: []
          });
        }
      }
      return result;
    },
    addWord(book) {
      if (this.rules.hyphen(this.inputwords) === true) {
        book.words.push(this.inputwords);
        this.inputwords = "";
      }
    },
    removeWord(book, index) {
      book.words.splice(index, 1);
    },
    save() {
      let filepath = "../assets/datasets.json";
      removeFile(filepath);
      writeFile(filepath, JSON.stringify(datasets));
    }
  }
};
</script>
