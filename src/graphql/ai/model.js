class Person {
  /**
   * Takes in a object with properties : id, x, y upper_length, lower_length, upper_width, lower_width,
   * @constructor
   */
  constructor(params) {
    this.id = params.id;
    this.upper_length = params.upper_length;
    this.upper_width = params.upper_width;
    this.lower_length = params.lower_length;
    this.lower_width = params.lower_width;
    this.score = 0;
    this.fitness = 0;
    this.parents = [];
    this.colors = [];
    this.params = params;
    this.brain = new NeuralNetwork(4, 100, 2);
    

    this.init();
  }

  init() {
    
  }

  add_to_world(world) {
  }

  show() {

  }

  adjust_score() {
    let score = this.upper_left_leg.position.x;
    this.score = score > 0 ? score : 0.001;
  }

  think(boundary) {
    let ground = boundary.ground;
    let distance_from_ground =
      ground.position.y -
      (this.upper_left_leg.position.y +
        this.upper_right_leg.position.y +
        this.lower_right_leg.position.y +
        this.lower_left_leg.position.y) /
        4;
    let torque =
      this.upper_left_leg.angularVelocity +
      this.upper_right_leg.angularVelocity +
      this.lower_right_leg.angularVelocity +
      this.lower_left_leg.angularVelocity;
    let vx =
      this.upper_left_leg.velocity.x +
      this.upper_right_leg.velocity.x +
      this.lower_right_leg.velocity.x +
      this.lower_left_leg.velocity.x;
    let vy =
      this.upper_left_leg.velocity.y +
      this.upper_right_leg.velocity.y +
      this.lower_right_leg.velocity.y +
      this.lower_left_leg.velocity.y;
    let input = [distance_from_ground / width, vx / 4, vy / 4, torque / 4];

    let result = this.brain.predict(input);

    // this.move_m1(result[0]);
    this.move_m2(result[0]);
    this.move_m3(result[1]);
  }

  clone() {
    let params = Object.assign({}, this.params);
    let new_person = new Person(params);
    new_person.brain.dispose();
    new_person.brain = this.brain.clone();
    return new_person;
  }

  kill() {
    // Dispose its brain
    this.brain.dispose();
  }

  mutate() {
    function fn(x) {
      if (random(1) < 0.05) {
        let offset = randomGaussian() * 0.5;
        let newx = x + offset;
        return newx;
      }
      return x;
    }

    let ih = this.brain.input_weights.dataSync().map(fn);
    let ih_shape = this.brain.input_weights.shape;
    this.brain.input_weights.dispose();
    this.brain.input_weights = tf.tensor(ih, ih_shape);

    let ho = this.brain.output_weights.dataSync().map(fn);
    let ho_shape = this.brain.output_weights.shape;
    this.brain.output_weights.dispose();
    this.brain.output_weights = tf.tensor(ho, ho_shape);
  }

  crossover(partner) {
    let parentA_in_dna = this.brain.input_weights.dataSync();
    let parentA_out_dna = this.brain.output_weights.dataSync();
    let parentB_in_dna = partner.brain.input_weights.dataSync();
    let parentB_out_dna = partner.brain.output_weights.dataSync();

    let mid = Math.floor(Math.random() * parentA_in_dna.length);
    let child_in_dna = [
      ...parentA_in_dna.slice(0, mid),
      ...parentB_in_dna.slice(mid, parentB_in_dna.length),
    ];
    let child_out_dna = [
      ...parentA_out_dna.slice(0, mid),
      ...parentB_out_dna.slice(mid, parentB_out_dna.length),
    ];

    let child = this.clone();
    let input_shape = this.brain.input_weights.shape;
    let output_shape = this.brain.output_weights.shape;

    child.brain.dispose();

    child.brain.input_weights = tf.tensor(child_in_dna, input_shape);
    child.brain.output_weights = tf.tensor(child_out_dna, output_shape);

    return child;
  }

  walk() {
    setInterval(() => {
      this.think(boundary);
    }, 100);
  }
}
