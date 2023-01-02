let Schema: any;
let model: any;

const dummySchema: typeof Schema = new Schema!!({
  name: { type: String, required: true },
});

export default model("Dummy", dummySchema);
