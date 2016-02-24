    <?php 

	define('WP_USE_THEMES', false);
	require('/blog/wp-blog-header.php');
    include('header.php'); 
	
	?>
    <!-- Page Header -->
    <!-- Set your background image for this header on the line below. -->
    <header class="intro-header" style="background-image: url('img/home-bg.jpg')">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                    <div class="site-heading">
                        <h1>Posts</h1>
                        <hr class="small">
                        <span class="subheading">Something something something.</span>
                    </div>
                </div>
            </div>
        </div>
    </header>

<!-- Main Content -->
	<div class="container">
		<div class="row">
            <div class="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-1">
                <h2 class="home-title">
                    <?php
                        if($_GET["cat"] == null) {
                            echo 'All Categories';
                        } else {
                            global $query_string;
                            $posts = query_posts($query_string.'&cat='.$_GET["cat"]);
                            $category = get_category($_GET["cat"]);
                            echo $category->name;
                        }
                    ?>
                </h2>
                <hr>
                <?php
                if(have_posts()):
    				while ( have_posts() ) : the_post(); ?>                  
                	   <div class="post-preview">
                    	   <a href="post.php?p=<?php echo the_id(); ?>">
                        	   <h2 class="post-title"><?php the_title(); ?></h2>
                        	   <!--TODO: eventually replace with subtitle plugin??? -->
                        	   <h3 class="post-subtitle"><?php the_subtitle(); ?></h3>
                    	   </a>
                    	   <p class="post-meta">Posted by <a href="about.php"><?php the_author(); ?></a> on <?php the_time('F j, Y'); ?> in <?php the_category(',', '', false); ?></p>
                	   </div>
               		   <hr>
    			<?php 
                    endwhile; 
                else:
                    echo 'No posts in this category!';
                endif;
                    wp_reset_query();
                ?>
            </div>
            <div class="col-lg-2 col-md-3 sidebar">
                <h3 class="title">Categories</h3>
                <hr>
                <a href="posts.php">All Categories</a><br>
                <?php 
                    $args = array(
                    'orderby'            => 'name',
                    'order'              => 'ASC',
                    'style'              => 'none',
                    'show_count'         => 0,
                    'hide_empty'         => 0,
                    'use_desc_for_title' => 1,
                    'child_of'           => 0,
                    'hierarchical'       => 1,
                    'title_li'           => '',
                    'show_option_none'   => '',
                    'echo'               => 1,
                    'taxonomy'           => 'category'
                    );
                    $categories = get_categories( $args ); 
                    foreach ( $categories as $category )
                    {
                        echo '<a href="'.'?cat='. $category->cat_ID . '" rel="bookmark">' . $category->name . '</a><br>';
                    } 
                ?> 
                    </ul>
            </div>
        </div>
    </div>
<?php include('footer.php'); ?>

