class Failed extends Phaser.Scene {
  constructor() {
    super('failed')
  }
  create() {
    const text = this.add.text(400, 250, 'FAILED', { fontSize: 30 })
    text.setOrigin(0.5)
    let highestScore = parseInt(localStorage.getItem('highest')) || 0
    const score = ScoreBoard.score
    if (score > highestScore) {
      localStorage.setItem('highest', score)
      highestScore = score
    }
    this.add.text(400, 150, 'HIGHEST SCORE: ' + highestScore, { fontSize: 30, color: 'white' })
      .setOrigin(0.5)
    this.add.text(400, 200, 'YOUR SCORE: ' + score, { fontSize: 30, color: 'white' })
      .setOrigin(0.5)

    const buttonBackground = this.add.rectangle(400, 350, 200, 80, 0xa36331)
    buttonBackground.setOrigin(0.5)

    const buttonText = this.add.text(400, 350, 'RESTART', { fontSize: 30, color: '#ffffff' })
    buttonText.setOrigin(0.5)


    this.add.container(0, 0, [buttonBackground, buttonText]);
    buttonText.setInteractive()
    buttonBackground.setInteractive()

    PlayerState.health = 3

    buttonText.on('pointerdown', () => {
      ScoreBoard.score = 0
      ScoreBoard.level = 1
      this.scene.start('invader1')
    })

    buttonBackground.on('pointerdown', () => {
      this.scene.start('invader1')
    })

  }
}
