class Background extends Phaser.Scene {
  preload() {

    this.load.image('bg', './assets/images/starBackground.png')
  }
  create() {
    const background = this.add.tileSprite(0, 0, 800, 600, 'bg')

    background.setOrigin(0)
    background.setTileScale(1, 1)

    const columns = Math.ceil(game.config.width / background.width)
    const rows = Math.ceil(game.config.height / background.height)

    background.setTileScale(columns, rows)
    background.setDepth(-1)
    this.bg = background
  }
  update() {
    this.bg.tilePositionY += 1
  }
}
class Start extends Background {
  constructor() {
    super('start')
  }
  create() {
    this.add.text(400, 200, 'INVADER', { fontSize: 48, color: 'white' }).setOrigin(0.5)
    const buttonBackground = this.add.rectangle(400, 300, 200, 80, 0xa36331)
    buttonBackground.setOrigin(0.5)

    const buttonText = this.add.text(400, 300, 'START GAME', { fontSize: 30, color: '#ffffff' })
    buttonText.setOrigin(0.5)


    this.add.container(0, 0, [buttonBackground, buttonText]);
    buttonText.setInteractive()
    buttonBackground.setInteractive()

    buttonText.on('pointerdown', () => {
      this.scene.start('invader1')
    })

    buttonBackground.on('pointerdown', () => {
      this.scene.start('invader1')
    })
    super.create()
  }
  update() {
    super.update()
  }

}
