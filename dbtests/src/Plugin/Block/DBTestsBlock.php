<?php

namespace Drupal\dbtests\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'DBTestsBlock' block.
 *
 * @Block(
 *  id = "dbtests_block",
 *  admin_label = @Translation("Dashboard Tests block"),
 * )
 */
class DBTestsBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build = [];
    $build['dbtests_block']['#markup'] = 'Dashboard Tests block here.';
    $build['dbtests_block']['#attached']['library'][] = 'dbtests/d3';
    $build['dbtests_block']['#attached']['library'][] = 'dbtests/dbtests_src';
    $build['dbtests_block']['#theme'] = 'dbtests';
    return $build;
  }

}