<?php 
define('WP_USE_THEMES', false);
require('blog/wp-blog-header.php');
include('header.php'); ?>

<!-- Styling specific for pinterest grid thingy -->
<style>
img {
width: 100%;
max-width: 100%;
height: auto;
}
#blog-landing {
margin-top: 81px;
position: relative;
max-width: 100%;
width: 100%;
}
.white-panel {
position: absolute;
background: white;
box-shadow: 0px 1px 2px rgba(0,0,0,0.3);
padding: 10px;
}
.white-panel h1 {
font-size: 1em;
}
.white-panel h1 a {
color: #4a386f;
}
.white-panel:hover {
outline: 3px solid #E6E6E6;
}
</style>
    <!-- Page Header -->
    <!-- Set your background image for this header on the line below. -->
    <header class="intro-header" style="background-image: url('img/projects-bg.jpg')">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                    <div class="page-heading">
                        <h1>Projects</h1>
                        <hr class="small">
                        <span class="subheading">This is what I do.</span>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <!-- Post Content -->
    <article>
        <div class="container">
            <div class="row">
                <section id="blog-landing">
                    <?php
                        global $query_string;
                        $posts = query_posts($query_string.'&cat=2');
                        if(have_posts()):
                            while( have_posts() ) : the_post();
                                $postbg = get_post_meta($post->ID, 'post-bg', true);
                                if($postbg == "") 
                                {
                                    $postbg = 'img/post-bg.jpg';
                                 }
                    ?>
                        <article class="white-panel">
                        <a href="post.php?p=<?php echo the_id(); ?>">
                            <img src="<?php echo $postbg; ?>" alt="ALT">
                            <h1><?php echo the_title("", "", false); ?></h1>
                            <p><?php the_excerpt(); ?></p>
                        </a>
                        </article>
                    <?php
                            endwhile;
                        else:
                            echo '<p><center>No projects found!</center></p>';
                        endif;
                        wp_reset_query();
                    ?>
                </section>
            </div>
        </div>
    </article>
    <script src="../js/pinterest_grid.js"></script>
    <script>
        $(document).ready(function() {

            $('#blog-landing').pinterest_grid({
                no_columns: 4,
                padding_x: 10,
                padding_y: 10,
                margin_bottom: 50,
                single_column_breakpoint: 800
            });

        });
    </script>
<?php include('footer.php'); ?>
