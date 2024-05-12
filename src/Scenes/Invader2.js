
/**
 *
 * @param {Phaser.Scene} scene
 */
const initPlayer2 = (scene) => {
  const player = scene.physics.add.sprite(-1000, -1000, 'invaderParts', 'playerShip1_red.png')
  player.setOrigin(0.5, 0)
  player.displayWidth = player.width * 2 / 3
  player.displayHeight = player.height * 2 / 3
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
const initPlayerLaser2 = (scene, player) => {
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

const initEnemies2 = (scene) => {
  const enemies = []
  for (let i = 0; i < 4; i++) {
    const enemy = scene.physics.add.sprite(100 + (200 * i), 10, 'invaderParts', 'enemyGreen1.png')
    enemy.displayWidth = enemy.width / 2
    enemy.displayHeight = enemy.height / 2
    enemy.setOrigin(0.5, 0)
    enemies.push(enemy)
    enemy.setVelocityY(Phaser.Math.Between(10, 50))
    const sign = Math.random() > 0.5 ? -1 : 1
    enemy.setVelocityX(Phaser.Math.Between(50, 100) * sign)
  }
  return enemies
}

/**
 *
 * @param {Phaser.Scene} scene
 * @param {Phaser.GameObjects.Sprite} enemy
 */
const initEnemyLaser2 = (scene, enemy) => {
  const x = enemy.x
  const y = enemy.y
  const height = enemy.displayHeight
  const vy = enemy.body.velocity.y

  const laser = scene.physics.add.sprite(0, 0, 'invaderParts', 'laserGreen12.png')
  laser.setPosition(x, y + height - 10)
  laser.setOrigin(0.5, 0)

  laser.setVelocityY(vy + Phaser.Math.Between(50, 100))
  return laser
}


class Invader2 extends Background {

  constructor() {
    super('invader2')
    this.sprites = {
      playerLasers: [],
      enemyLasers: [],
      enemies: []
    }



    this.score = 0
  }
  destroy() {
    clearInterval(this.interval)
  }
  enemyFire() {
    const enemies = this.sprites.enemies
    if (!enemies.length) return
    const enemy = Phaser.Math.RND.pick(enemies)
    const laser = initEnemyLaser2(this, enemy)
    this.sprites.enemyLasers.push(laser)
    this.physics.add.overlap(laser, this.sprites.player, this.failed.bind(this), null, this)
  }

  failed(laser) {
    laser.disableBody(true, true)
    if (PlayerState.health - 1 > 0) {
      const children = this.health.getAll()
      PlayerState.health = PlayerState.health - 1
      const child = children.pop()
      this.health.remove(child, true)
      return
    }
    clearInterval(this.interval)
    this.scene.start('failed')
  }

  preload() {
    this.load.setPath('./assets/images/')
    this.load.atlasXML('invaderParts', 'sheet.png', 'sheet.xml')
    super.preload()
  }
  create() {
    super.create()
    this.keys = {
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      fire: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    }
    const player = initPlayer2(this)
    this.sprites.player = player
    const enemies = initEnemies2(this)
    this.sprites.enemies = enemies
    enemies.forEach((enemy) => {
      this.physics.add.overlap(enemy, player, this.failed.bind(this), null, this)
    })
    this.interval = setInterval(() => {
      this.enemyFire()
    }, 1000)
    const container = this.add.container(20, 580)
    let i = 0
    while (i < PlayerState.health) {
      const life = this.add.sprite(0, 0, 'invaderParts', 'playerLife1_red.png')
      life.displayWidth = life.width / 2
      life.displayHeight = life.height / 2
      life.setPosition((life.displayWidth + 20) * i, 0)
      container.add(life)
      i++
    }
    this.health = container

    initScoreBoard(this)
  }
  updateScore() {
    // document.getElementById('score').innerHTML = ScoreBoard.score
    this.score.setText('SCORE: ' + ScoreBoard.score)
  }
  updateLevel() {
    // document.getElementById('level').innerHTML = ScoreBoard.level
    this.level.setText('LEVEL: ' + ScoreBoard.level)
  }
  update() {
    super.update()
    if (this.keys.left.isDown) {
      const x = this.sprites.player.x - 2
      this.sprites.player.setX(x)
    }
    if (this.keys.right.isDown) {
      const x = this.sprites.player.x + 2
      this.sprites.player.setX(x)
    }
    if (this.keys.fire.isDown) {
      const initCollide = () => {
        const lasers = initPlayerLaser2(this, this.sprites.player)
        const enemies = this.sprites.enemies

        enemies.slice().forEach((enemy) => {
          this.physics.add.overlap(enemy, lasers[0], getScore, null, this)
          this.physics.add.overlap(enemy, lasers[1], getScore, null, this)
        })

        this.sprites.playerLasers.push(...lasers)
      }

      if (this.timer) {
        clearTimeout(this.timer)
      }
      const getScore = (enemy, laser) => {
        ScoreBoard.score += 20

        this.updateScore()
        enemy.disableBody(true, true)
        laser.disableBody(true, true)
        let index = this.sprites.enemies.indexOf(enemy)
        index > -1 && this.sprites.enemies.splice(index, 1)
        index = this.sprites.playerLasers.indexOf(laser)
        index > -1 && this.sprites.playerLasers.splice(index, 1)

      }

      this.timer = setTimeout(() => {
        initCollide()
      }, 50)
    }

    this.outboxRemoved()
    if (!this.sprites.enemies.length) {
      this.scene.start('success')
      ScoreBoard.level += 1
      this.updateLevel()
    }
    const bounds = this.physics.world.bounds
    this.sprites.enemies.slice().forEach((enemy, i) => {
      const width = enemy.displayWidth
      const height = enemy.displayHeight
      const x = enemy.x
      const y = enemy.y

      if (x - width / 2 < bounds.left || x + width / 2 > bounds.right) {
        if (!enemy.timer) {
          enemy.body.velocity.x *= -1
        }
        enemy.timer = setTimeout(() => {
          enemy.body.velocity.x *= -1
          enemy.timer = null
        }, 1000)
      }
      if (y + height < bounds.top || y > bounds.bottom) {
        enemy.disableBody(true, true)
        this.sprites.enemies.splice(i, 1)
      }

    })

  }
  outboxRemoved() {
    const bounds = this.physics.world.bounds
    const removeOut = (objects) => {
      objects.slice().forEach((d, i) => {
        const width = d.displayWidth
        const height = d.displayHeight
        const x = d.x
        const y = d.y
        if (x + width < bounds.left || x > bounds.right ||
          y + height < bounds.top || y > bounds.bottom
        ) {
          d.disableBody(true, true)
          objects.splice(i, 1)
        }
      })

    }
    // removeOut(this.sprites.enemies)
    removeOut(this.sprites.enemyLasers)
    removeOut(this.sprites.playerLasers)
  }
}
