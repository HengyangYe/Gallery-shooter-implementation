class Start extends Phaser.Scene {
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
  }
}
