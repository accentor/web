import Vuetify from "vuetify";
import VueRouter from "vue-router";
import { mount, createLocalVue } from "@vue/test-utils";
import AlbumCard from "@/components/AlbumCard.vue";

const localVue = createLocalVue();
localVue.use(VueRouter);

const factory = (values = {}, album_values = {}) => {
  const vuetify = new Vuetify();
  const router = new VueRouter();

  return mount(AlbumCard, {
    localVue,
    vuetify,
    router,
    propsData: {
      album: {
        id: 1,
        title: "title",
        album_artists: [],
        album_labels: [
          {
            label_id: 1,
            catalogue_number: "catNr",
          },
          {
            label_id: 2,
            catalogue_number: "otherCatNr",
          },
        ],
        edition: null,
        edition_description: null,
        release: "1970-01-01",
        ...album_values,
      },
      ...values,
    },
    mocks: {
      $t: (msg) => msg,
    },
    stubs: ["AlbumActions"],
  });
};

describe("AlbumCard", () => {
  const wrapper = factory();

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("renders album title", () => {
    expect(wrapper.find(".v-card__title").text()).toMatch(/title/);
  });

  it("does not renders album title with edition description", () => {
    expect(wrapper.find(".v-card__title span")).toBeUndefined;
  });

  it("renders release date", () => {
    expect(wrapper.find(".album-release").text()).toMatch("1970-01-01");
  });

  it("does not render catalogue number", () => {
    expect(wrapper.find(".album-cat")).toBeUndefined;
  });
});

describe("AlbumCard with release description", () => {
  const wrapper = factory({}, { edition_description: "description" });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("renders album title with edition description", () => {
    expect(wrapper.find(".v-card__title span").text()).toMatch("(description)");
  });
});

describe("AlbumCard with CatNr", () => {
  const wrapper = factory({ labelForCatNr: { id: 1 } });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("renders correct catalogue number", () => {
    expect(wrapper.find(".album-cat").text()).toMatch("catNr");
  });
});
