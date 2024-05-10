
/**
 *
 * @param {Phaser.Scene} scene
 */
const initPlayer = (scene) => {
  const player = scene.physics.add.sprite(-1000, -1000, 'invaderParts', 'playerShip1_red.png')
  player.setOrigin(0.5, 0)
  player.displayWidth = player.width / 2
  player.displayHeight = player.height / 2
  const playerWidth = player.displayWidth
  const playerHeight = player.displayHeight
  player.setPosition((800 - playerWidth) / 2, 600 - playerHeight - 10)
  player.setCollideWorldBounds(true)
  return player
}

/**
 *
 * @param {Phaser.Scene} scene
 * @param {Phaser.GameObjects.Sprite} player
 */
const initPlayerLaser = (scene, player) => {
  const x = player.x
  const y = player.y
  const width = player.displayWidth
  const height = player.displayHeight
  const laser1 = scene.physics.add.sprite(x - width / 2, y + height / 2, 'invaderParts', 'laserRed01.png')
  const laser2 = scene.physics.add.sprite(x + width / 2 - 9, y + height / 2, 'invaderParts', 'laserRed01.png')
  laser1.setOrigin(0, 0)
  laser2.setOrigin(0, 0)

  laser1.setVelocityY(-200)
  laser2.setVelocityY(-200)
  return [laser1, laser2]
}
/**
 * @param {Phaser.Scene} scene
 */

const initEnemies = (scene) => {
  const enemies = []
  for (let i = 0; i < 4; i++) {
    const enemy = scene.physics.add.sprite(100 + (200 * i), 10, 'invaderParts', 'enemyRed1.png')
    enemy.displayWidth = enemy.width / 2
    enemy.displayHeight = enemy.height / 2
    enemy.setOrigin(0.5, 0)
    enemies.push(enemy)
  }
  return enemies
}


class Invader extends Phaser.Scene {

  constructor() {
    super('invader')
    this.sprites = {
      playerLasers: [],
      enemies: []
    }
    this.score = 0
  }

  preload() {
    this.load.setPath('./assets/images/')
    this.load.atlasXML('invaderParts', 'sheet.png', 'sheet.xml')
  }
  create() {
    this.keys = {
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      fire: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    }

    const player = initPlayer(this)
    this.sprites.player = player
    this.sprites.enemies = initEnemies(this)
    this.level = 1
  }
  updateScore() {
    document.getElementById('score').innerHTML = this.score
  }
  updateLevel() {
    document.getElementById('level').innerHTML = this.level
  }
  update() {
    if (this.keys.left.isDown) {
      const x = this.sprites.player.x - 1
      this.sprites.player.setX(x)
    }
    if (this.keys.right.isDown) {
      const x = this.sprites.player.x + 1
      this.sprites.player.setX(x)
    }
    if (this.keys.fire.isDown) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      const getScore = (enemy, laser) => {
        this.score += 10

        this.updateScore()
        enemy.disableBody(true, true)
        laser.disableBody(true, true)
        let index = this.sprites.enemies.indexOf(enemy)
        index > -1 && this.sprites.enemies.splice(index, 1)
        index = this.sprites.playerLasers.indexOf(laser)
        index > -1 && this.sprites.playerLasers.splice(index, 1)

      }
      this.timer = setTimeout(() => {
        const lasers = initPlayerLaser(this, this.sprites.player)
        const enemies = this.sprites.enemies

        enemies.slice().forEach((enemy) => {
          this.physics.add.overlap(enemy, lasers[0], getScore, null, this)
          this.physics.add.overlap(enemy, lasers[1], getScore, null, this)
        })

        this.sprites.playerLasers.push(...lasers)
      }, 60)
    }


  }
}
