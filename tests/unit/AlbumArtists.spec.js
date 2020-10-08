import Vuetify from "vuetify";
import VueRouter from "vue-router";
import { mount, createLocalVue } from "@vue/test-utils";
import AlbumArtists from "@/components/AlbumArtists.vue";

const localVue = createLocalVue();
localVue.use(VueRouter);

const factory = (values = {}, album_values = {}) => {
  const vuetify = new Vuetify();
  const router = new VueRouter();

  return mount(AlbumArtists, {
    localVue,
    vuetify,
    router,
    propsData: {
      album: {
        id: 1,
        title: "title",
        album_artists: [
          {
            artist_id: 2,
            name: "artist 2",
            separator: null,
            order: 2,
          },
          {
            artist_id: 1,
            name: "artist 1",
            separator: " / ",
            order: 1,
          },
        ],
        album_labels: [],
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
  });
};

describe("AlbumArtists", () => {
  const wrapper = factory();

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("renders link for every artist", () => {
    expect(wrapper.findAll("a").length).toBe(2);
  });

  it("renders artists' names in order", () => {
    const routerLinkArray = wrapper.findAll("a");
    expect(routerLinkArray.at(0).text()).toMatch("artist 1");
    expect(routerLinkArray.at(1).text()).toMatch("artist 2");
  });

  it("has title with artists name", () => {
    expect(wrapper.attributes().title).toBe("artist 1 / artist 2");
  });
});

describe("AlbumArtists without artists", () => {
  const wrapper = factory({}, { album_artists: [] });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("renders link for every artist", () => {
    expect(wrapper.findAll("routerlink-stub").length).toBe(0);
  });
});
